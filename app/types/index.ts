// Representa uma linha da consulta SQL
export interface WarehouseRecord {
	FILIAL: number;
	DIA: string; // Formato "YYYY-MM-DD"
	V_Interna: number;
	V_Externa: number;
	Compra: number;
	Estoque: number;
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
	purchases: StatCategory;
	internalSales: StatCategory;
	externalSales: StatCategory;
	sevenDayForecast: DailyOperation[];
}

export interface StatCategory {
	total: number;
	byMonth: { [month: string]: number };
}