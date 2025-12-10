'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { addMember, searchUserByEmail, USE_MOCKS } from '@/lib/api';
import { ListMember, User } from '@/lib/types';

type AddMemberDialogProps = {
	listId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onMemberAdded?: (member: ListMember) => void;
	existingEmails?: string[];
};

type Step = 'input' | 'confirm' | 'success';

export function AddMemberDialog({ listId, open, onOpenChange, onMemberAdded, existingEmails = [] }: AddMemberDialogProps) {
	const [email, setEmail] = useState('');
	const [step, setStep] = useState<Step>('input');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [foundUser, setFoundUser] = useState<User | null>(null);

	const resetDialog = () => {
		setEmail('');
		setStep('input');
		setIsLoading(false);
		setError(null);
		setFoundUser(null);
	};

	const handleClose = () => {
		resetDialog();
		onOpenChange(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const trimmedEmail = email.trim().toLowerCase();

		// Validation
		if (!trimmedEmail) {
			setError('Please enter an email address');
			return;
		}

		if (existingEmails.map((e) => e.toLowerCase()).includes(trimmedEmail)) {
			setError('This person is already a member');
			return;
		}

		setError(null);
		setIsLoading(true);

		try {
			// Step 1: Find user by email
			const user = await searchUserByEmail(trimmedEmail);

			if (!user) {
				setError('No account found with this email. They need to sign up first.');
				setIsLoading(false);
				return;
			}

			setFoundUser(user);
			setStep('confirm');
		} catch (err) {
			console.error('Error searching user:', err);
			setError('Something went wrong. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleConfirmAdd = async () => {
		if (!foundUser) return;

		setError(null);
		setIsLoading(true);

		try {
			const newMember = await addMember(listId, foundUser.email);

			if (newMember) {
				setStep('success');
				onMemberAdded?.(newMember);

				// Auto close after success
				setTimeout(handleClose, 1500);
			} else {
				setError('Failed to add member. Please try again.');
			}
		} catch (err) {
			console.error('Error adding member:', err);
			setError(err instanceof Error ? err.message : 'Failed to add member');
		} finally {
			setIsLoading(false);
		}
	};

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
			<DialogContent className="sm:max-w-md">
				{/* SUCCESS STATE */}
				{step === 'success' && foundUser && (
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
							<CheckCircle2 className="h-7 w-7 text-green-600" />
						</div>
						<h3 className="mt-4 text-lg font-semibold">Member Added!</h3>
						<p className="mt-1 text-sm text-muted-foreground">{foundUser.name} can now access this list</p>
					</div>
				)}

				{/* CONFIRM STATE */}
				{step === 'confirm' && foundUser && (
					<>
						<DialogHeader>
							<DialogTitle>Add this person?</DialogTitle>
							<DialogDescription>They will be able to view and edit items in this list.</DialogDescription>
						</DialogHeader>

						<div className="py-4">
							<div className="flex items-center gap-4 rounded-lg border p-4">
								<Avatar className="h-12 w-12">
									<AvatarImage src={foundUser.avatarUrl} alt={foundUser.name} />
									<AvatarFallback>{getInitials(foundUser.name)}</AvatarFallback>
								</Avatar>
								<div className="flex-1 min-w-0">
									<p className="font-medium truncate">{foundUser.name}</p>
									<p className="text-sm text-muted-foreground truncate">{foundUser.email}</p>
								</div>
							</div>

							{error && (
								<Alert variant="destructive" className="mt-4">
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}
						</div>

						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => setStep('input')} disabled={isLoading}>
								Back
							</Button>
							<Button onClick={handleConfirmAdd} disabled={isLoading}>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Adding...
									</>
								) : (
									'Add Member'
								)}
							</Button>
						</DialogFooter>
					</>
				)}

				{/* INPUT STATE */}
				{step === 'input' && (
					<>
						<DialogHeader>
							<DialogTitle>Add Member</DialogTitle>
							<DialogDescription>
								Invite a member to collaborate on this shopping list by entering their email address.
							</DialogDescription>
						</DialogHeader>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="member-email">
									Email Address <span className="text-red-500">*</span>
								</Label>
								<Input
									id="member-email"
									type="email"
									placeholder="person@example.com"
									value={email}
									onChange={(e) => {
										setEmail(e.target.value);
										if (error) setError(null);
									}}
									autoFocus
									required
									disabled={isLoading}
								/>

								{/* Helper for mock mode */}
								{USE_MOCKS && <p className="text-xs text-muted-foreground">💡 Try: jane@example.com, bob@example.com</p>}
							</div>

							{error && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							<DialogFooter>
								<Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
									Cancel
								</Button>
								<Button type="submit" disabled={!email.trim() || isLoading}>
									{isLoading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Searching...
										</>
									) : (
										'Send Invite'
									)}
								</Button>
							</DialogFooter>
						</form>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
