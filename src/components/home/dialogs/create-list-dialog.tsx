'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { ShoppingList } from '@/lib/types';

type CreateListDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreate: (name: string) => Promise<void>;
};

export function CreateListDialog({ open, onOpenChange, onCreate }: CreateListDialogProps) {
	const [name, setName] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim()) return;

		setIsLoading(true);
		try {
			await onCreate(name.trim());
			setName('');
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		if (!isLoading) {
			setName('');
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Create New List</DialogTitle>
						<DialogDescription>Give your shopping list a name to get started.</DialogDescription>
					</DialogHeader>

					<div className="py-4">
						<div className="space-y-2">
							<Label htmlFor="name">List name</Label>
							<Input
								id="name"
								placeholder="Weekly Groceries"
								value={name}
								onChange={(e) => setName(e.target.value)}
								disabled={isLoading}
								autoFocus
							/>
						</div>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading || !name.trim()}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating...
								</>
							) : (
								'Create List'
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
