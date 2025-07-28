import { FILIAL_NAMES } from "@/app/types";

interface FiltersProps {
	//objeto com valores atuais dos filtros
	filters: {
		filial: string;
		startDate: string;
		endDate: string;
	}
	//funcao para atualizar os filtrso
	onFilterChange: (newFilters: FiltersProps['filters']) => void;
	isLoading: boolean;
}

export default function Filters({ filters, onFilterChange, isLoading}: FiltersProps) {
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		onFilterChange({
			...filters,
			[name]: value,
		});
	};

	const clearFilters = () => {
		onFilterChange({
			filial: '',
			startDate: '',
			endDate: '',
		})
	}

	return (
		<div className="bg-white p-4 rounded-lg shadow-sm mb-6 border">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
				{/* FILIAL */}
				<div>
					<label htmlFor="filial" className="block text-sm font-medium text-gray-700">Filial</label>
					<select
						name="filial"
						id="filial"
						value={filters.filial}
						onChange={handleInputChange}
						disabled={isLoading}
						className="text-gray-500"
					>
						<option value="">Todas</option>
						{Object.entries(FILIAL_NAMES).map(([id, name]) => (
							<option key={id} value={id}>{name}</option>
						))}
					</select>
				</div>

				{/* START DATE */}
				<div>
					<label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Data Entrega Inicial</label>
					<input
						type="date"
						id="startDate"
						name="startDate"
						value={filters.startDate}
						onChange={handleInputChange}
						disabled={isLoading}
					/>
				</div>

				{/* END DATE */}
				<div>
					<label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Data Entrega Final</label>
					<input
						type="date"
						id="endDate"
						name="endDate"
						value={filters.endDate}
						onChange={handleInputChange}
						disabled={isLoading}
					/>
				</div>

				{/* LIMPAR FILTRO */}
				<div className="flex justify-start">
					<button
						onClick={clearFilters}
						disabled={isLoading}
						className="bg-green-800 text-white font-semibold text-sm px-4 py-2 rounded-md hover:bg-green-600 cursor-pointer transition-all duration-300 disabled:bg-green-300"
					>
						Limpar Filtros
					</button>
				</div>
			</div>
		</div>
	)
}