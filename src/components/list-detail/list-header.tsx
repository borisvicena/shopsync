import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Badge } from '../ui/badge';

type ListHeaderProps = {
	name: string;
	isOwner: boolean;
	onUpdate: () => void;
};

export function ListHeader({ name, isOwner, onUpdate }: ListHeaderProps) {
	return (
		<div className="flex flex-row items-center justify-between">
			<h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">{name}</h1>

			{isOwner && (
				<Button variant="outline" size="sm" onClick={onUpdate} className="gap-2">
					<Pencil />
					<span>Edit List Name</span>
				</Button>
			)}
		</div>
	);
}
