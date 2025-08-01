import { WarehouseRecord, ProcessedStats, StatCategory, DailyOperation, FILIAL_NAMES, PerFilialTotals } from '@/app/types';

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

const createEmptyStatCategory = (filialIds: number[]): StatCategory & { byFilial: { [key: number]: StatCategory } } => {
	const byFilial: { [key: number]: StatCategory } = {};
	filialIds.forEach(id => {
		byFilial[id] = { total: 0, byMonth: {} };
	});
	return { total: 0, byMonth: {}, byFilial }
}

export function processWarehouseData(data: WarehouseRecord[]): ProcessedStats {
	const today = new Date();
	today.setHours(0, 0, 0, 0); // Normaliza para o início do dia

	const filialIds = Object.keys(FILIAL_NAMES).map(Number);

	const purchases = createEmptyStatCategory(filialIds);
	const internalSales = createEmptyStatCategory(filialIds);
	const externalSales = createEmptyStatCategory(filialIds);
	const stockByFilial: { [key: number]: number } = {};
	filialIds.forEach(id => stockByFilial[id] = 0);

	const forecasts: ProcessedStats['forecasts'] = { geral: getNext7Days(today) };
	filialIds.forEach(id => { forecasts[id] = getNext7Days(today)} );
	const forecastMap = new Map<string, number>(forecasts.geral.map((day, index) => [day.date, index]));

	data.forEach(record => {
		const { FILIAL, DIA, Compra, V_Interna, V_Externa, Estoque } = record;

		stockByFilial[FILIAL] += Estoque;

		const recordDate = new Date(DIA + 'T12:00:00');

		// if (recordDate >= today) {
			const monthYear = recordDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
			
			if (Compra > 0) {
				purchases.total += Compra;
				purchases.byMonth[monthYear] = (purchases.byMonth[monthYear] || 0) + Compra;
				purchases.byFilial[FILIAL].total += Compra;
				purchases.byFilial[FILIAL].byMonth[monthYear] = (purchases.byFilial[FILIAL].byMonth[monthYear] || 0) + Compra;
			}

			if (V_Interna > 0) {
				internalSales.total += V_Interna;
				internalSales.byMonth[monthYear] = (internalSales.byMonth[monthYear] || 0) + V_Interna;
				internalSales.byFilial[FILIAL].total += V_Interna;
				internalSales.byFilial[FILIAL].byMonth[monthYear] = (internalSales.byFilial[FILIAL].byMonth[monthYear] || 0) + V_Interna;
			}

			if (V_Externa > 0) {
				externalSales.total += V_Externa;
				externalSales.byMonth[monthYear] = (externalSales.byMonth[monthYear] || 0) + V_Externa;
				externalSales.byFilial[FILIAL].total += V_Externa;
				externalSales.byFilial[FILIAL].byMonth[monthYear] = (externalSales.byFilial[FILIAL].byMonth[monthYear] || 0) + V_Externa;
			}

			const dayIndex = forecastMap.get(DIA);
			if (dayIndex !== undefined) {
				forecasts[FILIAL][dayIndex].compras += Compra;
				forecasts[FILIAL][dayIndex].vInterna += V_Interna;
				forecasts[FILIAL][dayIndex].vExterna += V_Externa;

				forecasts.geral[dayIndex].compras += Compra;
				forecasts.geral[dayIndex].vInterna += V_Interna;
				forecasts.geral[dayIndex].vExterna += V_Externa;
			}
		// }
	});

	Object.values(forecasts).forEach(forecastArray => {
		forecastArray.forEach(day => {
			day.saldo = day.compras - (day.vInterna + day.vExterna);
		})
	})

	const totalStock = filialIds.reduce((sum, id) => sum + stockByFilial[id], 0);

	return { totalStock, stockByFilial, purchases, internalSales, externalSales, forecasts };
}