"use client"

type ProductFilterType = 'ALL' | 'ARA' | 'CON';

interface ProductFilterProps {
    activeFilter: ProductFilterType;
    onFilterChange: (filter: ProductFilterType) => void;
    isLoading: boolean;
}

const filters: { label: string; value: ProductFilterType }[] = [
    { label: 'Todos', value: 'ALL' },
    { label: 'Arábica', value: 'ARA' },
    { label: 'Conilon', value: 'CON' },
];

export default function ProductFilter({ activeFilter, onFilterChange, isLoading }: ProductFilterProps) {
    return (
        <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-lg">
            {filters.map(filter => (
                <button
                    key={filter.value}
                    onClick={() => onFilterChange(filter.value)}
                    disabled={isLoading}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 w-24 cursor-pointer
                        ${activeFilter === filter.value
                            ? 'bg-white text-green-600 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-300/50'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    )
}