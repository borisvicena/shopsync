'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { User } from '@/lib/types';

type RemoveMemberDialogProps = {
	memberToRemove: User | null;
	setMemberToRemove: (member: User | null) => void;
	handleConfirmRemove: () => void;
};

export function RemoveMemberDialog({ memberToRemove, setMemberToRemove, handleConfirmRemove }: RemoveMemberDialogProps) {
	return (
		<AlertDialog open={!!memberToRemove} onOpenChange={(open) => !open && setMemberToRemove(null)}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Remove {memberToRemove?.name}?</AlertDialogTitle>
					<AlertDialogDescription>
						They will lose access to this shopping list immediately and won't be able to view or add items.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleConfirmRemove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
						Remove
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
