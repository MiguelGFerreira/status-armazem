import { WarehouseRecord, ProcessedStats, StatCategory, DailyTotal } from '@/app/types';

const getNext7Days = (today: Date): DailyTotal[] => {
	const days: DailyTotal[] = [];
	const locale = 'pt-BR';

	for (let i=0; i<7; i++) {
		const futureDate = new Date(today);
		futureDate.setDate(today.getDate() + i);

		days.push({
			date: futureDate.toISOString().split('T')[0],
			dayOfWeek: futureDate.toLocaleString(locale, { weekday: 'short' }),
			formattedDate: futureDate.toLocaleDateString(locale, { day: '2-digit', month: '2-digit' }),
			total: 0
		});
	}
	return days;
}

export function processWarehouseData(data: WarehouseRecord[]): ProcessedStats {
	const today = new Date();
	today.setHours(0, 0, 0, 0); // Normaliza para o início do dia

	const next7DaysTemplate = getNext7Days(today);

	let totalStock = 0;

	const purchases: StatCategory = { total: 0, next7Days: JSON.parse(JSON.stringify(next7DaysTemplate)), byMonth: {} };
	const internalSales: StatCategory = { total: 0, next7Days: JSON.parse(JSON.stringify(next7DaysTemplate)), byMonth: {} };
	const externalSales: StatCategory = { total: 0, next7Days: JSON.parse(JSON.stringify(next7DaysTemplate)), byMonth: {} };

	const dailyBreakdownMap = new Map<string, number>(next7DaysTemplate.map((day, index) => [day.date, index]));

	// soma do campo 'Estoque' nos registros do dia atual pois query so vem valor de estoque no dia de hoje.
	totalStock = data.reduce((sum, record) => sum + record.Estoque, 0);

	// Filtra apenas as operações futuras (Compras e Vendas)
	const futureOperations = data.filter(record => new Date(record.DIA + 'T12:00:00') >= today);

	futureOperations.forEach(record => {
		const recordDateStr = record.DIA;
		const recordDate = new Date(record.DIA + 'T12:00:00');
		const monthYear = recordDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

		const dayIndex = dailyBreakdownMap.get(recordDateStr);

		// Processa Compras
		if (record.Compra > 0) {
			purchases.total += record.Compra;
			if (dayIndex !== undefined) {
				purchases.next7Days[dayIndex].total += record.Compra;
			}
			purchases.byMonth[monthYear] = (purchases.byMonth[monthYear] || 0) + record.Compra;
		}

		// Processa Vendas Internas
		if (record.V_Interna > 0) {
			internalSales.total += record.V_Interna;
			if (dayIndex !== undefined) {
				internalSales.next7Days[dayIndex].total += record.V_Interna;
			}
			internalSales.byMonth[monthYear] = (internalSales.byMonth[monthYear] || 0) + record.V_Interna;
		}

		// Processa Vendas Externas
		if (record.V_Externa > 0) {
			externalSales.total += record.V_Externa;
			if (dayIndex !== undefined) {
				externalSales.next7Days[dayIndex].total += record.V_Externa;
			}
			externalSales.byMonth[monthYear] = (externalSales.byMonth[monthYear] || 0) + record.V_Externa;
		}
	});

	return { totalStock, purchases, internalSales, externalSales };
}