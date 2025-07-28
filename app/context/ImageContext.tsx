"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface ImageVersion {
	CODIGO: number;
	TIME_STAMP: string;
}

interface ImageContextType {
	versions: ImageVersion[];
	selectedVersion: number | null;
	setSelectedVersion: (code: number) => void;
	isLoading: boolean;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export function ImageProvider({ children }: { children: ReactNode }) {
	const { data: versions, error, isLoading: swrLoading } = useSWR<ImageVersion[]>('/api/image-versions', fetcher);
	const [selectedVersion, setSelectedVersion] = useState<number | null>(
		versions && versions.length > 0 ? versions[0].CODIGO : null
	);

	useEffect(() => {
		// define a mais recente como padrao
		if (versions && versions.length > 0 && selectedVersion === null) {
			setSelectedVersion(versions[0].CODIGO);
		}
	}, [versions, selectedVersion]);

	const value = {
		versions: versions || [],
		selectedVersion,
		setSelectedVersion,
		isLoading: Boolean(swrLoading || (versions && !selectedVersion)), // Carregando enquanto nao tem selecionado
	};

	return (
		<ImageContext.Provider value={value}>
			{children}
		</ImageContext.Provider>
	);
}

// Hook customizado para facilitar o uso do contexto
export function useImageContext() {
	const context = useContext(ImageContext);
	if (context === undefined) {
		throw new Error('useImageContext deve ser usado dentro de um ImageProvider');
	}
	return context;
}