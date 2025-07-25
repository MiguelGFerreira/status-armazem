import { ReactNode } from 'react';
import { StatCategory } from '@/app/types';

interface StatCardProps {
	title: string;
	data: StatCategory;
	icon: ReactNode;
	colorClass: string;
	barColorClass: string;
}

const formatNumber = (num: number) => num.toLocaleString('pt-BR');

function DailyBreakdown({ breakdown, barColorClass }: { breakdown: StatCategory['next7Days']; barColorClass: string }) {
	const maxTotal = Math.max(...breakdown.map(d => d.total), 1);

	return (
		<div className='mt-3 space-y-2'>
			{breakdown.map((day) => {
				const barWidth = day.total > 0 ? (day.total / maxTotal) * 100 : 0;
				return (
					<div key={day.date} className='grid grid-cols-6 gap-2 items-center text-sm'>
						{/* DATA */}
						<div className='col-span-1 text-gray-600 font-medium text-right capitalize'>
							<span className='hidden sm:inline'>{day.dayOfWeek}</span> {day.formattedDate}
						</div>

						{/* BARRA */}
						<div className='col-span-3 bg-gray-200 rounded-full h-4'>
							<div
								className={`${barColorClass} h-4 rounded-full transition-all duration-500`}
								style={{ width: `${barWidth}%` }}
							/>
						</div>

						{/* TOTAL */}
						<div className='col-span-2 text-gray-800 font-semibold text-left'>
							{formatNumber(day.total)} KG
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default function StatCard({ title, data, icon, colorClass, barColorClass }: StatCardProps) {
	return (
		<div className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4">
			<div className="flex items-center gap-4">
				<div className={`p-3 rounded-full ${colorClass}`}>
					{icon}
				</div>
				<div>
					<h3 className="text-lg font-semibold text-gray-600">{title}</h3>
					<p className="text-3xl font-bold text-gray-800">{formatNumber(data.total)} KG</p>
				</div>
			</div>

			<div className="border-t pt-4">
				<h4 className='text-md font-semibold text-gray-700'>Programação Diária</h4>
				<DailyBreakdown breakdown={data.next7Days} barColorClass={barColorClass} />

				<h4 className="text-sm font-medium text-gray-500 mt-3 mb-1">Total por Mês:</h4>
				<div className="space-y-1 text-sm">
					{Object.keys(data.byMonth).length > 0 ? (
						Object.entries(data.byMonth).map(([month, value]) => (
							<div key={month} className="flex justify-between">
								<span className="text-gray-600 capitalize">{month}:</span>
								<span className="font-semibold text-gray-700">{formatNumber(value)} KG</span>
							</div>
						))
					) : (
						<p className="text-gray-500 italic">Nenhum registro futuro.</p>
					)}
				</div>
			</div>
		</div>
	);
}