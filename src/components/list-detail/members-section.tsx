'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Crown } from 'lucide-react';
import { RemoveMemberDialog } from './dialogs/remove-member-dialog';
import { User } from '@/lib/types';
import { getInitials } from '@/lib/utils';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

type MembersSectionProps = {
	owner: User;
	members: User[];
	isOwner: boolean;
	onRemoveMember: (memberId: string) => void;
	onAddMember: () => void;
};

export function MembersSection({ owner, members, isOwner, onRemoveMember, onAddMember }: MembersSectionProps) {
	const { t } = useTranslation();
	const [memberToRemove, setMemberToRemove] = useState<User | null>(null);

	const handleConfirmRemove = () => {
		if (memberToRemove) {
			onRemoveMember(memberToRemove.id);
			setMemberToRemove(null);
		}
	};

	const totalMembersLength = members.length + 1;
	const visibleMembers = members.slice(0, 3);
	const remainingCount = members.length - 3;

	return (
		<>
			<div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border bg-card p-4">
				{/* Owner Avatar + Name */}
				<div className="flex items-center gap-2">
					<div className="relative">
						<Avatar className="h-10 w-10">
							<AvatarImage src={owner.avatarUrl} alt={owner.name} />
							<AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
								{getInitials(owner.name)}
							</AvatarFallback>
						</Avatar>
						<div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 ring-2 ring-card">
							<Crown className="h-2.5 w-2.5 text-white" />
						</div>
					</div>
					<div className="flex flex-col">
						<p className="text-sm font-medium text-foreground">{owner.name}</p>
						<Badge variant="secondary" className="text-xs w-fit">
							{t('listDetail.members.owner')}
						</Badge>
					</div>
				</div>

				{/* Member Avatars (max 3, then +N) */}
				{members.length > 0 && (
					<div className="flex items-center gap-2 flex-1 min-w-0">
						<div className="flex -space-x-2">
							{visibleMembers.map((member) => (
								<Avatar key={member.id} className="h-10 w-10 border-2 border-background">
									<AvatarImage src={member.avatarUrl} alt={member.name} />
									<AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
										{getInitials(member.name)}
									</AvatarFallback>
								</Avatar>
							))}
							{remainingCount > 0 && (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<button className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium text-muted-foreground hover:bg-muted/80 transition-colors">
											+{remainingCount}
										</button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start" className="w-56">
										{members.slice(3).map((member) => (
											<DropdownMenuItem key={member.id} className="flex items-center gap-2">
												<Avatar className="h-6 w-6">
													<AvatarImage src={member.avatarUrl} alt={member.name} />
													<AvatarFallback className="text-xs">{getInitials(member.name)}</AvatarFallback>
												</Avatar>
												<div className="flex flex-col">
													<span className="text-sm font-medium">{member.name}</span>
													<span className="text-xs text-muted-foreground">{member.email}</span>
												</div>
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							)}
						</div>
						<span className="text-sm text-muted-foreground truncate">
							{members.length === 1 ? `1 ${t('listDetail.members.member')}` : `${members.length} ${t('listDetail.members.members')}`}
						</span>
					</div>
				)}

				{/* Invite Button */}
				{isOwner && (
					<Button variant="outline" size="sm" onClick={onAddMember} className="gap-2 w-full sm:w-auto sm:ml-auto">
						<UserPlus className="h-4 w-4" />
						<span>{t('common.invite')}</span>
					</Button>
				)}

				{/* Empty state text */}
				{members.length === 0 && (
					<p className="text-sm text-muted-foreground sm:ml-auto text-center sm:text-left">
						{t('listDetail.members.noCollaborators')} {isOwner && `• ${t('listDetail.members.clickInvite')}`}
					</p>
				)}
			</div>

			<RemoveMemberDialog memberToRemove={memberToRemove} setMemberToRemove={setMemberToRemove} handleConfirmRemove={handleConfirmRemove} />
		</>
	);
}
