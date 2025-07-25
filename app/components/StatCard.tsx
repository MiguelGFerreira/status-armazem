import { ReactNode } from 'react';
import { StatCategory } from '@/app/types';

interface StatCardProps {
	title: string;
	data: StatCategory;
	icon: ReactNode;
	colorClass: string;
}

const formatNumber = (num: number) => num.toLocaleString('pt-BR');


export default function StatCard({ title, data, icon, colorClass }: StatCardProps) {
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