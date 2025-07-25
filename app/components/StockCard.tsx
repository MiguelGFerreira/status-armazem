import { Warehouse } from 'lucide-react';
import { FILIAL_NAMES } from '../types';

interface StockCardProps {
	totalStock: number;
	stockByFilial: { [key: number]: number };
}

const formatNumber = (num: number) => num.toLocaleString('pt-BR');

export default function StockCard({ totalStock, stockByFilial }: StockCardProps) {
	return (
		<div className="bg-tristao-trading text-white p-6 rounded-xl shadow-lg">
			<div className='flex flex-col gap-4'>
				{/* TOTAL GERAL */}
				<div className='flex items-center gap-4'>
					<Warehouse size={40} />
					<div>
						<h2 className='text-lg font-semibold'>Estoque Atual Total</h2>
						<p className='text-4xl font-bold'>{formatNumber(totalStock)} KG</p>
					</div>
				</div>

				{/* ESTOQUE POR FILIAL */}
				<div className='border-t border-sky-500 pt-3 flex justify-around text-center'>
					{Object.entries(stockByFilial).map(([id, value]) => (
						<div key={id}>
							<p className='text-sm font-medium text-white'>{FILIAL_NAMES[Number(id)]}</p>
							<p className='font-bold text-lg'>{formatNumber(value)}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}