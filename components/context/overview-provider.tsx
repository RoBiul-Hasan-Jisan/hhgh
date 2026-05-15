'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { format } from 'date-fns';

import { dateFormat } from 'constants/date';

import { useDate } from './datepicker-provider';

const OverviewContext = createContext(null);

interface Data {
	expenses: Array<any>;
	income: Array<any>;
	subscriptions: Array<any>;
	investments: Array<any>;
}

export const OverviewContextProvider = (props: any) => {
	const { date } = useDate();
	const [expensesData, setExpensesData] = useState<any[]>([]);
	const [investmentsData, setInvestmentsData] = useState<any[]>([]);
	const [incomeData, setIncomeData] = useState<any[]>([]);
	const [subscriptionsData, setSubscriptionsData] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	const { children, ...others } = props;

	// Load data from localStorage
	useEffect(() => {
		setLoading(true);
		const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
		const investments = JSON.parse(localStorage.getItem('investments') || '[]');
		const income = JSON.parse(localStorage.getItem('income') || '[]');
		const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');

		setExpensesData(expenses);
		setInvestmentsData(investments);
		setIncomeData(income);
		setSubscriptionsData(subscriptions);
		setLoading(false);
	}, []);

	const mutateExpenses = () => {
		const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
		setExpensesData(expenses);
	};

	const data = {
		expenses: expensesData,
		investments: investmentsData,
		income: incomeData,
		subscriptions: subscriptionsData,
		mutate: {
			mutateExpenses,
		},
	};

	return (
		<OverviewContext.Provider value={{ loading, data }} {...others}>
			{children}
		</OverviewContext.Provider>
	);
};

export const useOverview = () => {
	const context = useContext<any>(OverviewContext);
	if (context === undefined) {
		throw new Error(`useUser must be used within a OverviewContext.`);
	}
	return context;
};
