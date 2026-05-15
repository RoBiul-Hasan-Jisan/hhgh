'use client';

import { useState } from 'react';

import { useUser } from 'components/context/auth-provider';
import CircleLoader from 'components/loader/circle';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';

import Modal from '.';

export default function DeleteModal({ show, onHide }: { show: boolean; onHide: () => void }) {
	const user = useUser();
	const [loading, setLoading] = useState(false);
	const [verify, setVerify] = useState('');

	const onDelete = async () => {
		if (verify === user.email) {
			setLoading(true);
			// Clear all localStorage data
			localStorage.clear();
			setLoading(false);
			// Redirect to home
			window.location.href = '/';
		}
	};

	return (
		<Modal show={show} title="Delete Your Account" onHide={onHide} someRef={null}>
			<div className="text-sm text-primary dark:text-muted-foreground">
				Type this account email to delete your account and its data.
			</div>
			<Input
				className="mt-3"
				placeholder="Email"
				type="email"
				onChange={(event) => {
					setVerify(event.target.value);
				}}
			/>
			<Button
				onClick={onDelete}
				variant={'destructive'}
				disabled={loading || verify !== user.email}
				className="user-select-none mt-4 w-full"
			>
				{loading ? <CircleLoader /> : 'Confirm delete'}
			</Button>
		</Modal>
	);
}
