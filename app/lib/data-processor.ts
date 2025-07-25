import { WarehouseRecord, ProcessedStats, StatCategory, DailyOperation } from '@/app/types';

const getNext7Days = (today: Date): DailyOperation[] => {
	const days: DailyOperation[] = [];
	const locale = 'pt-BR';

	for (let i=0; i<7; i++) {
		const futureDate = new Date(today);
		futureDate.setDate(today.getDate() + i);

		days.push({
			date: futureDate.toISOString().split('T')[0],
			dayOfWeek: futureDate.toLocaleString(locale, { weekday: 'short' }),
			formattedDate: futureDate.toLocaleDateString(locale, { day: '2-digit', month: '2-digit' }),
			compras: 0,
			vInterna: 0,
			vExterna: 0,
			saldo: 0,
		});
	}
	return days;
}

export function processWarehouseData(data: WarehouseRecord[]): ProcessedStats {
	const today = new Date();
	today.setHours(0, 0, 0, 0); // Normaliza para o início do dia

	const sevenDayForecast = getNext7Days(today);
	const forecastMap = new Map<string, number>(sevenDayForecast.map((day, index) => [day.date, index]));

	let totalStock = 0;

	const purchases: StatCategory = { total: 0, byMonth: {} };
	const internalSales: StatCategory = { total: 0, byMonth: {} };
	const externalSales: StatCategory = { total: 0, byMonth: {} };

	// soma do campo 'Estoque' nos registros do dia atual pois query so vem valor de estoque no dia de hoje.
	totalStock = data.reduce((sum, record) => sum + record.Estoque, 0);

	// Filtra apenas as operações futuras (Compras e Vendas)
	const futureOperations = data.filter(record => new Date(record.DIA + 'T12:00:00') >= today);

	futureOperations.forEach(record => {
		const recordDate = new Date(record.DIA + 'T12:00:00');
		const monthYear = recordDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

		// totais gerais
		purchases.total += record.Compra;
		internalSales.total += record.V_Interna;
		externalSales.total += record.V_Externa;

		//totais mensais
		if (record.Compra > 0) purchases.byMonth[monthYear] = (purchases.byMonth[monthYear] || 0) + record.Compra;
		if (record.V_Interna > 0) internalSales.byMonth[monthYear] = (internalSales.byMonth[monthYear] || 0) + record.V_Interna;
		if (record.V_Externa > 0) externalSales.byMonth[monthYear] = (externalSales.byMonth[monthYear] || 0) + record.V_Externa;

		//preenche tablea de 7 dias
		const dayIndex = forecastMap.get(record.DIA);
		if (dayIndex !== undefined) {
			const dayData = sevenDayForecast[dayIndex];
			dayData.compras = record.Compra;
			dayData.vInterna = record.V_Interna;
			dayData.vExterna = record.V_Externa;
		}
	});

	sevenDayForecast.forEach(day => {
		day.saldo = day.compras - (day.vInterna + day.vExterna);
	})

	return { totalStock, purchases, internalSales, externalSales, sevenDayForecast };
}