'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, UserMinus, Crown } from 'lucide-react';
import { User } from '@/lib/types';
import { Button } from '../ui/button';
import { getInitials } from '@/lib/utils';

export function MemberRow({ member, canRemove, onRemove }: { member: User; canRemove: boolean; onRemove: () => void }) {
	return (
		<div className={'flex items-center gap-3 rounded-lg p-2 -mx-2 transition-colors hover:bg-muted/50'}>
			{/* Avatar */}
			<div className="relative shrink-0">
				<Avatar className="h-9 w-9">
					<AvatarImage src={member.avatarUrl} alt={member.name} />
					<AvatarFallback className={'text-xs font-medium bg-muted text-muted-foreground'}>{getInitials(member.name)}</AvatarFallback>
				</Avatar>
			</div>

			{/* Info */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-foreground truncate">{member.name}</span>
				</div>
				<p className="text-xs text-muted-foreground truncate">{member.email}</p>
			</div>

			{/* Actions */}
			{canRemove && (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground">
							<MoreHorizontal className="h-4 w-4" />
							<span className="sr-only">Member options</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<DropdownMenuItem onClick={onRemove} className="text-destructive focus:text-destructive focus:bg-destructive/10">
							<UserMinus className="mr-2 h-4 w-4" />
							Remove from list
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	);
}
