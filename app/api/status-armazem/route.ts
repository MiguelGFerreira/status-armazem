import { NextResponse } from 'next/server';
import { processWarehouseData } from '@/app/lib/data-processor';
import { dbQuery } from '@/app/lib/db';
import { WarehouseRecord } from '@/app/types';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const codimg = searchParams.get('codimg');
    const productFilter = searchParams.get('productFilter');

    if (!codimg) {
        return NextResponse.json({ message: 'CODIMG obrigatorio.' }, { status: 400 });
    }

    let productWhereClause = '';
    //const params: { [key: string]: any } = { codimg: parseInt(codimg, 10) };

    console.log('ROUTE - productFilter: ', productFilter);
    if (productFilter && (productFilter.toUpperCase() === 'ARA' || productFilter.toUpperCase() === 'CON')) {
        productWhereClause = `AND LEFT(PRODUTO, 3) = '${productFilter.toUpperCase()}'`;
    } else {
        productWhereClause = `AND LEFT(PRODUTO, 3) IN ('ARA', 'CON')`;
    }
    //console.log('SAR - CODIMG: ', codimg);

    const warehouseQuery = `
        SELECT 
            FILIAL,
            DIA,
            ISNULL(SUM([VI]), 0) AS V_Interna,
            ISNULL(SUM([VE]), 0) AS V_Externa,
            ISNULL(SUM([CO]), 0) AS Compra,
            ISNULL(SUM([EST]), 0) AS Estoque
        FROM (
            SELECT 
                FILIAL,
                OPERACAO,
                REPLACE(PRODUTO, '-KG', '') AS PRODUTO,
                ID,
                DATAENTREGA,
                CASE 
                    WHEN DATEDIFF(DAY, GETDATE(), CAST(DATAENTREGA AS SMALLDATETIME)) < 0
                        THEN 0
                    ELSE DATEDIFF(DAY, GETDATE(), CAST(DATAENTREGA AS SMALLDATETIME)) + 1
                    END AS DIAS,
                CASE 
                    WHEN GETDATE() > CAST(DATAENTREGA AS SMALLDATETIME)
                        THEN CONVERT(DATE, GETDATE() - 1)
                    ELSE CONVERT(DATE, CAST(DATAENTREGA AS SMALLDATETIME))
                    END AS DIA,
                CODQUA,
                PADRAO,
                BEBIDA,
                CLASSIFICACAO,
                QUANTIDADE,
                PENEIRA,
                COLUNAMES,
                ALMOX
            FROM TCE_IMG_POSQUAL
            WHERE CODIMG = ${parseInt(codimg, 10)}
            ${productWhereClause}
        ) AS TAB
        PIVOT(SUM(QUANTIDADE) FOR OPERACAO IN ([VI], [VE], [CO], [EST])) AS PVT
        GROUP BY 
            FILIAL,
            DIA
        ORDER BY
            DIA;
        `;
    console.log(warehouseQuery);
    try {
        // função executa a consulta no db
        const databaseResult = await dbQuery(warehouseQuery);

        // conversão para garantir o formato correto. O processador espera strings 'YYYY-MM-DD'.
        const rawData: WarehouseRecord[] = databaseResult.map(row => ({
            ...row,
            DIA: new Date(row.DIA).toISOString().split('T')[0],
        }));

        const processedData = processWarehouseData(rawData);

        return NextResponse.json(processedData);

    } catch (error) {
        console.error('Erro na API /api/status-armazem:', error);
        return NextResponse.json(
            { message: 'Erro ao buscar ou processar os dados do armazém.', error: (error as Error).message },
            { status: 500 }
        );
    }
}

// Habilita modo dinâmico para garantir que rota seja executada a cada requisição
export const dynamic = 'force-dynamic';