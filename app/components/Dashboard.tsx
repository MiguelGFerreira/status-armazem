"use client";

import { useEffect, useState } from 'react';
import { DailyOperation, FILIAL_NAMES, ProcessedStats } from '@/app/types';
import StockCard from './StockCard';
import StatCard from './StatCard';
import { ArrowDownToLine, ArrowUpFromLine, Ship } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import ForecastTable from './ForescastTable';
import { useImageContext } from '../context/ImageContext';

export default function Dashboard() {
	const [data, setData] = useState<ProcessedStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { selectedVersion, isLoading: isVersionLoading } = useImageContext();

	const [activeFilial, setActiveFilial] = useState<string>('geral');

	console.log('DASHBOARD - selectedVersion: ', selectedVersion);

	useEffect(() => {
		if (selectedVersion === null) return;

		setLoading(true);
		setError(null);

		async function fetchData() {
			try {
				const response = await fetch(`/api/status-armazem?codimg=${selectedVersion}`);
				if (!response.ok) {
					throw new Error('Falha ao buscar dados da API');
				}
				const result: ProcessedStats = await response.json();
				setData(result);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido');
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, [selectedVersion]);

	if (loading || isVersionLoading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return <div className="text-center text-red-500">Erro: {error}</div>;
	}

	if (!data) {
		return null;
	}

	const filialIds = Object.keys(FILIAL_NAMES);

	return (
		<div className="space-y-8">
			{/* RESUMO */}
			<div className='md:col-span-2'>
				<StockCard
					totalStock={data.totalStock}
					stockByFilial={data.stockByFilial}
				/>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				<StatCard
					title="Compras a Entrar"
					data={data.purchases}
					icon={<ArrowDownToLine size={24} className="text-green-800" />}
					colorClass="bg-green-100"
					detailsUrl="/detalhes/compras"
				/>
				<StatCard
					title="Vendas Internas a Embarcar"
					data={data.internalSales}
					icon={<ArrowUpFromLine size={24} className="text-orange-800" />}
					colorClass="bg-orange-100"
					detailsUrl="/detalhes/vendas-internas"
				/>
				<StatCard
					title="Vendas Externas a Embarcar"
					data={data.externalSales}
					icon={<Ship size={24} className="text-blue-800" />}
					colorClass="bg-blue-100"
					detailsUrl="/detalhes/vendas-externas"
				/>
			</div>

			{/* TABELA DIARIA */}
			<div className='bg-white p-4 sm:p-6 rounded-xl shadow-md'>
				<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4'>
					<h3 className='text-xl font-semibold text-gray-800 mb-2 sm:mb-0'>Programação Diária Consolidada</h3>
					<div className='flex items-center gap-2 p-1 bg-gray-100 rounded-lg'>
						<button
							onClick={() => setActiveFilial('geral')}
							className={`px-3 py-1 text-sm font-semibold rounded-md cursor-pointer transition-all duration-200 ${activeFilial === 'geral' ? 'bg-white text-green-600 shadow' : 'text-gray-600 hover:bg-gray-200'}`}
						>
							Visão Geral
						</button>
						{filialIds.map(id => (
							<button
								key={id}
								onClick={() => setActiveFilial(id)}
								className={`px-3 py-1 text-sm font-semibold rounded-md cursor-pointer transition-all duration-200 ${activeFilial === id ? 'bg-white text-green-600 shadow' : 'text-gray-600 hover:bg-gray-200'}`}
							>
								{FILIAL_NAMES[Number(id)]}
							</button>
						))}
					</div>
				</div>

				<ForecastTable data={data.forecasts[activeFilial as keyof typeof data.forecasts] as DailyOperation[]} />
			</div>
		</div>
	);
}