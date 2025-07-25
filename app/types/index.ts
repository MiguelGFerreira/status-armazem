// Representa uma única linha da sua consulta SQL
export interface WarehouseRecord {
	FILIAL: number;
	DIA: string; // Formato "YYYY-MM-DD"
	V_Interna: number;
	V_Externa: number;
	Compra: number;
	Estoque: number;
}

export interface DailyTotal {
	date: string;	//"2025-07-26"
	dayOfWeek: string;	// "Sab"
	formattedDate: string;	// "26/07"
	total: number;
}

// Representa os dados já processados para exibição
export interface ProcessedStats {
	totalStock: number;
	purchases: StatCategory;
	internalSales: StatCategory;
	externalSales: StatCategory;
}

export interface StatCategory {
	total: number;
	next7Days: DailyTotal[];
	byMonth: { [month: string]: number };
}