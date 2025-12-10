import { User } from '@/lib/types';
import { Card, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Crown } from 'lucide-react';
import { getInitials } from '@/lib/utils';

export function OwnerRow({ owner }: { owner: User }) {
	return (
		<div className={'flex items-center gap-3 rounded-lg p-2 -mx-2 transition-colors'}>
			{/* Avatar */}
			<div className="relative shrink-0">
				<Avatar className="h-9 w-9">
					<AvatarImage src={owner.avatarUrl} alt={owner.name} />
					<AvatarFallback className={'text-xs font-medium bg-primary/10 text-primary'}>{getInitials(owner.name)}</AvatarFallback>
				</Avatar>
				<div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 ring-2 ring-card">
					<Crown className="h-2.5 w-2.5 text-white" />
				</div>
			</div>

			{/* Info */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-foreground truncate">{owner.name}</span>
					<span className="text-[10px] font-medium uppercase tracking-wider text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded shrink-0">
						Owner
					</span>
				</div>
				<p className="text-xs text-muted-foreground truncate">{owner.email}</p>
			</div>
		</div>
	);
}
