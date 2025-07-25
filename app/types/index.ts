// Representa uma linha da consulta SQL
export interface WarehouseRecord {
	FILIAL: number;
	DIA: string; // Formato "YYYY-MM-DD"
	V_Interna: number;
	V_Externa: number;
	Compra: number;
	Estoque: number;
}

export const FILIAL_NAMES: { [key: number]: string } = {
	20: 'Varginha',
	21: 'Viana',
}

export interface PerFilialTotals {
	compras: number;
	vInterna: number;
	vExterna: number;
	estoque: number;
}

export interface DailyOperation {
	date: string;
	dayOfWeek: string;
	formattedDate: string;
	compras: number;
	vInterna: number;
	vExterna: number;
	saldo: number;
}

// Dados processados para exibição
export interface ProcessedStats {
	totalStock: number;

	purchases: StatCategory & { byFilial: { [filialId: number]: StatCategory } };
	internalSales: StatCategory & { byFilial: { [filialId: number]: StatCategory } };
	externalSales: StatCategory & { byFilial: { [filialId: number]: StatCategory } };

	stockByFilial: { [filialId: number]: number; };

	forecasts: {
		geral: DailyOperation[];
		[filialId: number]: DailyOperation[];
	}
}

export interface StatCategory {
	total: number;
	byMonth: { [month: string]: number };
}