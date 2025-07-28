import { NextResponse } from "next/server";
import sql from "mssql";
import { connectToDatabase } from "@/app/lib/db";

const OPERACAO_MAP: { [key: string]: string } = {
	'compras': 'CO',
	'vendas-internas': 'VI',
	'vendas-externas': 'VE',
}

const ALLOWED_SORT_COLUMNS = ['DATAENTREGA', 'FILIAL', 'PRODUTO', 'QUANTIDADE', 'CLASSIFICACAO']

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);

	//params da url
	const operacaoKey = searchParams.get('operacao') || 'compras'; // vai cair em compras por default
	const operacao = OPERACAO_MAP[operacaoKey];
	if (!operacao) {
		return NextResponse.json({ message: 'Operação inválida' }, { status: 400 });
	}

	const page = parseInt(searchParams.get('page') || '1', 10);
	const limit = parseInt(searchParams.get('limit') || '20', 10);

	let sortBy = searchParams.get('sortBy') || 'DATAENTREGA'; // vai cair em dataentrega por default
	if (!ALLOWED_SORT_COLUMNS.includes(sortBy)) {
		sortBy = 'DATAENTREGA'; // se nao for permitido volta pra dataentrega
	}

	const sortOrder = searchParams.get('sortOrder') === 'desc' ? 'DESC' : 'ASC';
	const filial = searchParams.get('filial');
	const startDate = searchParams.get('startDate');
	const endDate = searchParams.get('endDate');
	const offset = (page - 1) * limit;

	// CONSTRUINDO QUERY DE FORMA DINMAICA
	const whereClauses = ["OPERACAO = @operacao"];
	
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const params: { [key: string]: any } = { operacao: { type: sql.VarChar, value: operacao } };

	whereClauses.push("CODIMG = @codimg");
	params.codimg = { type: sql.Int, value: 1428 };

	if (filial) {
		whereClauses.push("FILIAL = @filial");
		params.filial = { type: sql.Int, value: parseInt(filial, 10) };
	}

	if (startDate) {
		whereClauses.push("DATAENTREGA >= @startDate");
		params.startDate = { type: sql.Date, value: startDate };
	}

	if (endDate) {
		whereClauses.push("DATAENTREGA <= @endDate");
		params.endDate = { type: sql.Date, value: endDate };
	}

	const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

	// pra fazer a paginacao
	const countQuery = `SELECT COUNT(*) AS TOTAL FROM TCE_IMG_POSQUAL ${whereString}`;

	const dataQuery = `
		SELECT CAST(DATAENTREGA AS SMALLDATETIME) DATAENTREGA, FILIAL, REPLACE(PRODUTO, '-KG', '') as PRODUTO, 
				ID, QUANTIDADE, CLASSIFICACAO, BEBIDA, PENEIRA 
		FROM TCE_IMG_POSQUAL
		${whereString}
		ORDER BY ${sortBy} ${sortOrder}
		OFFSET @offset ROWS
		FETCH NEXT @limit ROWS ONLY
	`
	console.log(dataQuery);

	params.offset = { type: sql.Int, value: offset };
	params.limit = { type: sql.Int, value: limit };

	try {
		const pool = await connectToDatabase();

		//executa a contagem primiero
		const countRequest = pool.request();
		Object.keys(params).forEach(key => {
			if (key != 'offset' && key != 'limit') {
				countRequest.input(key, params[key].type, params[key].value);
			}
		});
		const countResult = await countRequest.query(countQuery);
		const totalRecords = countResult.recordset[0].TOTAL;

		//executa a query dos dados
		const dataRequest = pool.request();
		Object.keys(params).forEach(key => dataRequest.input(key, params[key].type, params[key].value));
		const dataResult = await dataRequest.query(dataQuery);

		return NextResponse.json({
			data: dataResult.recordset,
			totalRecords: totalRecords,
			totalPages: Math.ceil(totalRecords / limit),
			currentPage: page,
		});

	} catch (error) {
		console.error('Erro ao buscar detalhes:', error);
		return NextResponse.json({ message: 'Erro ao buscar detalhes', error: (error as Error).message }, { status: 500 });
	}
}