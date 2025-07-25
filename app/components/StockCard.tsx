import { Warehouse } from 'lucide-react';

interface StockCardProps {
	totalStock: number;
}

const formatNumber = (num: number) => num.toLocaleString('pt-BR');

export default function StockCard({ totalStock }: StockCardProps) {
	return (
		<div className="bg-tristao-trading text-white p-6 rounded-xl shadow-lg">
			<div className="flex items-center gap-4">
				<Warehouse size={40} />
				<div>
					<h2 className="text-lg font-semibold">Estoque Atual Total</h2>
					<p className="text-4xl font-bold">{formatNumber(totalStock)} KG</p>
				</div>
			</div>
		</div>
	);
}