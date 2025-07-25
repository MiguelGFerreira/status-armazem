import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { DailyOperation } from "../types";

interface ForecastTableProps {
	data: DailyOperation[];
}

const formatNumber = (num: number) => num.toLocaleString('pt-BR');

export default function ForecastTable({ data }: ForecastTableProps) {
	return (
		<div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
			<h3 className="text-xl font-semibold text-gray-800 mb-4">Programação Diária Consolidada</h3>
			<div className="overflow-x-auto">
				<div className="min-w-full">
					{/* Header tabela */}
					<div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-500 border-b pb-2 mb-2">
						<div className="col-span-2 sm:col-span-2">Dia</div>
						<div className="col-span-4 sm:col-span-2 text-right">Compras</div>
						<div className="col-span-3 sm:col-span-2 text-right">V. Interna</div>
						<div className="col-span-3 sm:col-span-2 text-right">V. Externa</div>
						<div className="col-span-12 sm:col-span-4">Saldo do dia (Entrada - Saida)</div>
					</div>

					{/* Body tabela */}
					<div className="space-y-1">
						{data.map((day) => {
							const saldoPositivo = day.saldo > 0;
							const saldoNegativo = day.saldo < 0;
							const saldoZero = day.saldo === 0 && (day.compras > 0 || day.vInterna > 0 || day.vExterna > 0);

							const saldoColor = saldoPositivo ? 'text-green-600' : saldoNegativo ? 'text-red-600' : 'text-gray-700'

							const isToday = new Date().toISOString().split('T')[0] === day.date;

							return (
								<div key={day.date} className={`grid grid-cols-12 gap-4 items-center p-2 rounded-lg ${isToday ? 'bg-blue-50' : ''}`}>
									<div className="col-span-2 sm:col-span=2 font-medium text-gray-800 capitalize">
										{day.dayOfWeek}, {day.formattedDate}
									</div>
									<div className="col-span-4 sm:col-span-2 text-right text-gray-700">{formatNumber(day.compras)}</div>
									<div className="col-span-3 sm:col-span-2 text-right text-gray-700">{formatNumber(day.vInterna)}</div>
									<div className="col-span-3 sm:col-span-2 text-right text-gray-700">{formatNumber(day.vExterna)}</div>
									<div className={`col-span-12 sm:col-span-4 text-right font-bold text-lg flex items-center justify-end gap-2 ${saldoColor}`}>
										<span>{formatNumber(day.saldo)} KG</span>
										{saldoPositivo && <TrendingUp size={20} />}
										{saldoNegativo && <TrendingDown size={20} />}
										{saldoZero && <Minus size={20} />}
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}