'use client';

import { useCallback, useState } from 'react';

import { toast } from 'sonner';

import Add from 'components/add-button';
import { useUser } from 'components/context/auth-provider';
import { useData } from 'components/context/data-provider';
import DataTable from 'components/table/data-table';

import { lookup } from 'lib/lookup';

import { expensesCategory } from 'constants/categories';
import messages from 'constants/messages';

import { columns } from './columns';

const categories = Object.keys(expensesCategory)
	.filter(Boolean)
	.map((categoryKey) => ({
		label: expensesCategory[categoryKey].name,
		value: categoryKey,
	}));

export default function ExpenseTable() {
	const [selected, setSelected] = useState({});
	const { data, loading, filter, mutate } = useData();
	const user = useUser();

	const onDelete = useCallback(
		(id: string) => {
			try {
				const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
				const filtered = expenses.filter((e: any) => e.id !== id);
				localStorage.setItem('expenses', JSON.stringify(filtered));
				toast.success(messages.deleted);
				mutate();
			} catch {
				toast.error(messages.error);
			}
		},
		[mutate]
	);

	const onEdit = useCallback((data: any) => {
		setSelected(data);
	}, []);

	const onHide = useCallback(() => {
		setSelected({});
	}, []);

	const onLookup = useCallback((name: string) => lookup({ data, name }), [data]);

	return (
		<>
			<DataTable
				options={{ user, onDelete, onEdit }}
				filter={filter}
				columns={columns}
				data={data}
				loading={loading}
				filename="Expenses"
				categories={categories}
			/>
			<Add onHide={onHide} onLookup={onLookup} selected={selected} mutate={mutate} type="expenses" />
		</>
	);
}
