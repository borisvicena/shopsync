'use client';

import { useState } from 'react';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Mail } from 'lucide-react';
import { OwnerRow } from './owner-row';
import { RemoveMemberDialog } from './dialogs/remove-member-dialog';
import { User } from '@/lib/types';
import { MemberRow } from './member-row';
import { Alert, AlertTitle } from '../ui/alert';

type MembersSectionProps = {
	owner: User;
	members: User[];
	isOwner: boolean;
	onRemoveMember: (memberId: string) => void;
	onAddMember: () => void;
};

export function MembersSection({ owner, members, isOwner, onRemoveMember, onAddMember }: MembersSectionProps) {
	const [memberToRemove, setMemberToRemove] = useState<User | null>(null);

	const handleConfirmRemove = () => {
		if (memberToRemove) {
			onRemoveMember(memberToRemove.id);
			setMemberToRemove(null);
		}
	};

	// Calculate the total members length with owner (+ 1)
	const totalMembersLength = members.length + 1;

	return (
		<>
			<Card className="inset-shadow-xs shadow-sm">
				<CardHeader>
					<CardTitle>Members</CardTitle>
					<CardDescription className="inline-flex items-center gap-1 text-xs text-muted-foreground">
						<Users size={14} />
						{totalMembersLength}
					</CardDescription>
					<CardAction>
						{isOwner && (
							<Button size="sm" variant="outline" onClick={onAddMember} className="text-xs h-7">
								<Plus />
								Invite
							</Button>
						)}
					</CardAction>
				</CardHeader>

				<CardContent>
					<OwnerRow owner={owner} />

					{members.map((member) => (
						<MemberRow key={member.id} member={member} canRemove={isOwner} onRemove={() => setMemberToRemove(member)} />
					))}
				</CardContent>

				{totalMembersLength === 1 && isOwner && (
					<CardFooter className="w-full">
						<Alert className="bg-muted/20 border-dashed text-muted-foreground">
							<Mail />
							<AlertTitle>Invite others to collaborate on this shopping list</AlertTitle>
						</Alert>
					</CardFooter>
				)}
			</Card>

			<RemoveMemberDialog memberToRemove={memberToRemove} setMemberToRemove={setMemberToRemove} handleRemoveMember={handleConfirmRemove} />
		</>
	);
}
