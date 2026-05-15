'use client';

import { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';

import { views } from 'constants/table';

const DataContext = createContext(null);

interface Data {
	Data: Array<any>;
}

type Props = {
	children: React.ReactNode;
	name: string;
	isNotRange?: boolean;
};

export const DataContextProvider = (props: Props) => {
	const { children, name, isNotRange = false } = props;
	const [filter, setFilter] = useState(views.thisMonth.key);
	const [categories, setCategories] = useState<string[]>([]);
	const [data, setData] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	// Load data from localStorage
	useEffect(() => {
		setIsLoading(true);
		const storageKey = `data_${name}`;
		const storedData = localStorage.getItem(storageKey);
		if (storedData) {
			setData(JSON.parse(storedData));
		} else {
			setData([]);
		}
		setIsLoading(false);
	}, [name]);

	const onFilter = useCallback((categories: string[] = []) => {
		setCategories(categories);
	}, []);

	const mutate = useCallback(() => {
		const storageKey = `data_${name}`;
		const storedData = localStorage.getItem(storageKey);
		if (storedData) {
			setData(JSON.parse(storedData));
		}
	}, [name]);

	const value = useMemo(
		() => ({ data, loading: isLoading, filter: { name: filter, setFilter, onFilter }, mutate }),
		[data, isLoading, filter, mutate, onFilter]
	);

	return <DataContext.Provider value={value as any}>{children}</DataContext.Provider>;
};

export const useData = () => {
	const context = useContext<any>(DataContext);
	if (context === undefined) {
		throw new Error(`useData must be used within a DataContext.`);
	}
	return context;
};
