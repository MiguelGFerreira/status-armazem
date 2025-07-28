"use client";

import React from "react";
import { useImageContext } from "../context/ImageContext";

const formatDate = (dateString: string) => new Date(dateString).toLocaleString('pt-BR', {
	day: '2-digit', month: '2-digit', year: 'numeric',
	hour: '2-digit', minute: '2-digit', second: '2-digit'
});

export default function ImageVersionFilter() {
	const { versions, selectedVersion, setSelectedVersion, isLoading } = useImageContext();

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedVersion(Number(e.target.value));
	};

	return (
		<div>
			<label htmlFor="image-version" className="block text-xs font-medium text-white">Versão da Imagem</label>
			<select
				name="image-version"
				id="image-version"
				value={selectedVersion || ''}
				onChange={handleChange}
				disabled={isLoading || versions.length === 0}
				className="block w-full text-white sm:w-80"
			>
				{isLoading && <option>Carregando versões...</option>}
				{versions.map(version => (
					<option key={version.CODIGO} value={version.CODIGO} className="text-black">
						{version.CODIGO} - Gerado em: {formatDate(version.TIME_STAMP)}
					</option>
				))}
			</select>
		</div>
	)
}