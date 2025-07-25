"use client";

import { useEffect, useState } from 'react';
import { ProcessedStats } from '@/app/types';
import StockCard from './StockCard';
import StatCard from './StatCard';
import { ArrowDownToLine, ArrowUpFromLine, Ship } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import ForecastTable from './ForescastTable';

export default function Dashboard() {
	const [data, setData] = useState<ProcessedStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch('/api/status-armazem');
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
	}, []);

	if (loading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return <div className="text-center text-red-500">Erro: {error}</div>;
	}

	if (!data) {
		return null;
	}

	return (
		<div className="space-y-8">
			<div className='space-y-6'>
				<StockCard totalStock={data.totalStock} />
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				<StatCard
					title="Total Compras a Entrar"
					data={data.purchases}
					icon={<ArrowDownToLine size={24} className="text-green-800" />}
					colorClass="bg-green-100"
				/>
				<StatCard
					title="Vendas Internas a Embarcar"
					data={data.internalSales}
					icon={<ArrowUpFromLine size={24} className="text-orange-800" />}
					colorClass="bg-orange-100"
				/>
				<StatCard
					title="Vendas Externas a Embarcar"
					data={data.externalSales}
					icon={<Ship size={24} className="text-blue-800" />}
					colorClass="bg-blue-100"
				/>
			</div>

			<ForecastTable data={data.sevenDayForecast} />
		</div>
	);
}