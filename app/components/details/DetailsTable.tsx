import { FILIAL_NAMES } from "@/app/types";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface TableProps {
	data: any[];
	onSort: (column: string) => void;
	sortBy: string;
	sortOrder: 'asc' | 'desc';
	isLoading: boolean;
}

const formatNumber = (num: number) => num.toLocaleString('pt-BR');
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

// Header da tabela como componente para reutilizar
const SortableHeader = ({ label, column, sortBy, sortOrder, onSort }: any) => (
	<th scope="col" className="px-4 py-3">
		<button onClick={() => onSort(column)} className="group flex items-center gap-2">
			{label}
			{sortBy === column ? (
				sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
			) : (
				<ArrowUpDown size={16} className="text-gray-400 group-hover:text-gray-700" />
			)}
		</button>
	</th>
);

export default function DetailsTable({ data, onSort, sortBy, sortOrder, isLoading }: TableProps) {
	const headers = [
		{ label: 'Data Entrega', key: 'DATAENTREGA' },
		{ label: 'Filial', key: 'FILIAL' },
		{ label: 'Produto', key: 'PRODUTO' },
		{ label: 'Quantidade (SC)', key: 'QUANTIDADE' },
		{ label: 'Classificação', key: 'CLASSIFICACAO' },
		{ label: 'ID', key: 'ID' },
	];

	if (isLoading) {
		return (
			<div className="animate-pulse">
				<div className="h-12 bg-gray-200 rounded-t-md w-full mb-2"></div>
				{[...Array(10)].map((_, i) => (
					<div key={i} className="h-10 bg-gray-200 rounded-md w-full mb-1"></div>
				))}
			</div>
		);
	}

	if (data.length === 0) {
		return (
			<div className="text-center py-10 bg-gray-50 rounded-md">
				<h3 className="text-lg font-medium text-gray-700">Nenhum registro encontrado</h3>
				<p className="text-sm text-gray-500">Tente ajustar os filtros para encontrar o que procura</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto border rounded-lg">
			<table className="min-w-full divide-y divide-gray-200 text-sm">
				<thead className="bg-gray-50 text-left text-gray-600 font-semibold">
					<tr>
						{headers.map(header => (
							<SortableHeader
								key={header.key}
								label={header.label}
								column={header.key}
								sortBy={sortBy}
								orderSort={sortOrder}
								onSort={onSort}
							/>
						))}
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200 text-gray-500">
					{data.map((row, index) => (
						<tr key={index} className="hover:bg-gray-50">
							<td className="px-4 py-3 whitespace-nowrap">{formatDate(row.DATAENTREGA)}</td>
							<td className="px-4 py-3 whitespace-nowrap">{FILIAL_NAMES[row.FILIAL] || row.FILIAL}</td>
							<td className="px-4 py-3 whitespace-nowrap">{row.PRODUTO}</td>
							<td className="px-4 py-3 whitespace-nowrap text-right font-medium">{formatNumber(row.QUANTIDADE)}</td>
							<td className="px-4 py-3 whitespace-nowrap">{row.CLASSIFICACAO}</td>
							<td className="px-4 py-3 whitespace-nowrap">{row.ID}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}