'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SWRConfig } from 'swr';

interface User {
	currency: string;
	locale: string;
	isPremium: boolean;
	email: string;
}

const AuthContext = createContext(null);

const localStorageFetcher = async (url: string) => {
	const storageKey = `data_${url}`;
	const data = localStorage.getItem(storageKey);
	return data ? JSON.parse(data) : [];
};

export const AuthProvider = (props: any) => {
	const [initial, setInitial] = useState(true);
	const [user, setUser] = useState<User | null>(null);
	const { children, ...others } = props;

	useEffect(() => {
		// Initialize user from localStorage
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		} else {
			// Create default user
			const defaultUser = {
				currency: 'USD',
				locale: 'en-US',
				isPremium: false,
				email: 'guest@example.com',
			};
			localStorage.setItem('user', JSON.stringify(defaultUser));
			setUser(defaultUser);
		}
		setInitial(false);
	}, []);

	const value = useMemo(() => {
		return {
			initial,
			user,
			signOut: () => {
				localStorage.clear();
				setUser(null);
			},
		};
	}, [initial, user]);

	return (
		<AuthContext.Provider value={value} {...others}>
			<SWRConfig value={{ fetcher: localStorageFetcher }}>{!initial ? children : null}</SWRConfig>
		</AuthContext.Provider>
	);
};

export const useUser = () => {
	const context = useContext<any>(AuthContext);
	if (context === undefined) {
		throw new Error(`useUser must be used within a AuthContext.`);
	}
	return context?.user ?? null;
};
