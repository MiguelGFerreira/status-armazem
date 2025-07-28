import { connectToDatabase } from "@/app/lib/db";
import sql from 'mssql';
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const query = `
			SELECT TOP 10 CODIGO, TIME_STAMP
			FROM TCE_IMG_CABECALHO
			ORDER BY TIME_STAMP DESC
		`;

		await connectToDatabase();
		const result = await new sql.Request().query(query);

		return NextResponse.json(result.recordset);
	} catch (error) {
		console.error("Erro na api de versoes da imagem:", error);
		return NextResponse.json({ error: "Erro ao buscar versoes da imagem."}, { status: 500 });
	}
}