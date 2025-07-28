// app/components/StatCard.tsx

import { ReactNode } from 'react';
import { FILIAL_NAMES, StatCategory } from '@/app/types';
import Link from 'next/link';

interface StatCardProps {
	title: string;
	data: StatCategory & { byFilial: { [filialId: number]: StatCategory } };
	icon: ReactNode;
	colorClass: string;
	detailsUrl: string;
}

const formatNumber = (num: number) => num.toLocaleString('pt-BR');

export default function StatCard({ title, data, icon, colorClass, detailsUrl }: StatCardProps) {
	return (
		<Link href={detailsUrl} className='block hover:shadow-xl transition-shadow duration-300 rounded-xl'>
			<div className="bg-white p-4 sm:p-6 rounded-xl shadow-md flex flex-col h-full">
				{/* TOTAL GERAL */}
				<div className="flex items-center gap-4 pb-4 border-b">
					<div className={`p-3 rounded-full ${colorClass}`}>{icon}</div>
					<div>
						<h3 className="text-lg font-semibold text-gray-700">{title}</h3>
						<p className="text-3xl font-bold text-gray-800">{formatNumber(data.total)} KG</p>
					</div>
				</div>

				{/* POR FILIAL */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 pt-4 flex-grow">
					{Object.entries(data.byFilial).map(([filialId, filialData]) => (
						<div key={filialId} className="flex flex-col">
							{/* SUBTOTAL */}
							<div className="text-center md:text-left">
								<h4 className="font-bold text-green-800">{FILIAL_NAMES[Number(filialId)]}</h4>
								<p className="font-semibold text-gray-700 text-xl">{formatNumber(filialData.total)} KG</p>
							</div>

							{/* MENSAL */}
							<div className="border-t mt-2 pt-2 text-sm space-y-1">
								<h5 className="font-semibold text-gray-500 mb-1">Por Mês:</h5>
								{Object.keys(filialData.byMonth).length > 0 ? (
									Object.entries(filialData.byMonth).map(([month, value]) => (
										<div key={month} className="flex justify-between">
											<span className="text-gray-600 capitalize">{month}:</span>
											<span className="font-semibold text-gray-700">{formatNumber(value)}</span>
										</div>
									))
								) : (
									<p className="text-gray-500 italic">Nenhum registro futuro.</p>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</Link>
	);
}