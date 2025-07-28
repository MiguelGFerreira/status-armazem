"use client";

import DetailsTable from "@/app/components/details/DetailsTable";
import Filters from "@/app/components/details/Filters";
import Pagination from "@/app/components/details/Pagination";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const OPERACAO_TITLES: { [key: string]: string } = {
	'compras': 'Compras a Entrar',
	'vendas-internas': 'Vendas Internas',
	'vendas-externas': 'Vendas Externas',
}

export default function DetailsPage() {
	const params = useParams();
	const operacao = Array.isArray(params.operacao) ? params.operacao[0] : params.operacao;

	const [page, setPage] = useState(1);
	const [limit] = useState(20);
	const [sortBy, setSortBy] = useState('DATAENTREGA');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [filters, setFilters] = useState({ filial: '', startDate: '', endDate: '' });

	const apiUrl = `/api/detalhes?operacao=${operacao}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&filial=${filters.filial}&startDate=${filters.startDate}&endDate=${filters.endDate}`;
	const { data, error, isLoading } = useSWR(apiUrl, fetcher);

	const handleSort = (column: string) => {
		if (sortBy === column) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
		} else {
			setSortBy(column);
			setSortOrder('asc');
		}
		setPage(1); // reseta prap primeira pagina quando mudar a ordenacao
	}

	const handleFilterChange = (newFilters: typeof filters) => {
		setFilters(newFilters);
		setPage(1);
	};

	const pageTitle = OPERACAO_TITLES[operacao!] || 'Detalhes';

	if (error) return <div>Falha ao carregar os dados.</div>;

	return (
		<main className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
			<div className="max-w-7xl mx-auto">
				<div className="mb-6">
					<Link href="/" className="text-blue-600 hover:underline text-sm">
						Voltar ao Dashboard
					</Link>
					<h1 className="text-4xl font-bold text-gray-800 mt-2">{pageTitle}</h1>
				</div>

				<Filters
					filters={filters}
					onFilterChange={handleFilterChange}
					isLoading={isLoading}
				/>

				<DetailsTable
					data={data?.data || []}
					onSort={handleSort}
					sortBy={sortBy}
					sortOrder={sortOrder}
					isLoading={isLoading}
				/>

				{data && data.totalPages > 0 && (
					<Pagination
						currentPage={data.currentPage}
						totalPages={data.totalPages}
						totalRecords={data.totalRecords}
						onPageChange={setPage}
						isLoading={isLoading}
						limit={limit}
					/>
				)}
			</div>
		</main>
	)
}