'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Trash2, Package, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ListItem } from '@/lib/types';
import { cn } from '@/lib/utils';

type ItemsListProps = {
	items: ListItem[];
	onToggleItem: (itemId: string) => void;
	onDeleteItem: (itemId: string) => void;
};

function ItemRow({ item, onToggle, onDelete }: { item: ListItem; onToggle: () => void; onDelete: () => void }) {
	const [isChecking, setIsChecking] = useState(false);

	const handleToggle = () => {
		setIsChecking(true);
		onToggle();
		// Reset animation state after animation completes
		setTimeout(() => setIsChecking(false), 300);
	};

	return (
		<div
			role="listitem"
			className={cn(
				'group relative flex items-start gap-4 rounded-lg border bg-card p-4 transition-all duration-200',
				item.completed ? 'border-border/50 bg-muted/30' : 'border-border hover:border-primary/20 hover:shadow-sm'
			)}
		>
			{/* Checkbox */}
			<div className="pt-0.5">
				<Checkbox
					id={`item-${item.id}`}
					checked={item.completed}
					onCheckedChange={handleToggle}
					aria-label={`Mark "${item.title}" as ${item.completed ? 'incomplete' : 'complete'}`}
					className={cn(
						'h-5 w-5 rounded-full transition-all',
						isChecking && 'scale-110',
						item.completed && 'border-primary bg-primary data-[state=checked]:bg-primary'
					)}
				/>
			</div>

			{/* Content */}
			<div className="min-w-0 flex-1 space-y-1">
				{/* Title */}
				<label
					htmlFor={`item-${item.id}`}
					className={cn(
						'block cursor-pointer text-sm font-medium leading-tight transition-all duration-200',
						item.completed ? 'text-muted-foreground line-through decoration-muted-foreground/50' : 'text-foreground'
					)}
				>
					{item.title}
				</label>

				{/* Notes */}
				{item.notes && (
					<p
						className={cn(
							'text-sm leading-snug transition-colors',
							item.completed ? 'text-muted-foreground/60' : 'text-muted-foreground'
						)}
					>
						{item.notes}
					</p>
				)}

				{/* Metadata */}
				<div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
					<TooltipProvider delayDuration={400}>
						<Tooltip>
							<TooltipTrigger asChild>
								<span className="inline-flex items-center gap-1 text-xs text-muted-foreground/70">
									<Clock className="h-3 w-3" />
									{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
								</span>
							</TooltipTrigger>
							<TooltipContent side="bottom" className="text-xs">
								Created {new Date(item.createdAt).toLocaleDateString()}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<span className="text-muted-foreground/30">•</span>

					<span className="inline-flex items-center gap-1 text-xs text-muted-foreground/70">
						<User className="h-3 w-3" />
						{item.createdBy}
					</span>

					{/* Quantity & Unit (if present) */}
					{item.quantity && item.quantity > 1 && (
						<>
							<span className="text-muted-foreground/30">•</span>
							<span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
								<Package className="h-3 w-3" />
								{item.quantity} {item.unit || 'pcs'}
							</span>
						</>
					)}
				</div>
			</div>

			{/* Delete Button */}
			<TooltipProvider delayDuration={400}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							size="icon"
							variant="ghost"
							className={cn(
								'h-8 w-8 shrink-0 text-muted-foreground/50 transition-all',
								'opacity-0 group-hover:opacity-100',
								'hover:bg-destructive/10 hover:text-destructive'
							)}
							onClick={onDelete}
							aria-label={`Delete "${item.title}"`}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="left" className="text-xs">
						Delete item
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			{/* Completed indicator line */}
			{item.completed && <div className="absolute bottom-0 left-0 h-0.5 w-full rounded-b-lg bg-primary/20" />}
		</div>
	);
}

export function ItemsList({ items, onToggleItem, onDeleteItem }: ItemsListProps) {
	const [itemToDelete, setItemToDelete] = useState<ListItem | null>(null);

	const handleConfirmDelete = () => {
		if (itemToDelete) {
			onDeleteItem(itemToDelete.id);
			setItemToDelete(null);
		}
	};

	// Empty state
	if (items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 py-12 text-center">
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
					<Package className="h-6 w-6 text-muted-foreground" />
				</div>
				<h3 className="mt-4 text-sm font-medium text-foreground">No items yet</h3>
				<p className="mt-1 text-sm text-muted-foreground">Add your first item to get started</p>
			</div>
		);
	}

	// Separate completed and pending items
	const pendingItems = items.filter((item) => !item.completed);
	const completedItems = items.filter((item) => item.completed);

	return (
		<>
			<div className="space-y-2" role="list" aria-label="Shopping list items">
				{/* Pending Items */}
				{pendingItems.map((item) => (
					<ItemRow key={item.id} item={item} onToggle={() => onToggleItem(item.id)} onDelete={() => setItemToDelete(item)} />
				))}

				{/* Completed Section */}
				{completedItems.length > 0 && pendingItems.length > 0 && (
					<div className="flex items-center gap-3 py-3">
						<div className="h-px flex-1 bg-border" />
						<span className="text-xs font-medium text-muted-foreground">Completed ({completedItems.length})</span>
						<div className="h-px flex-1 bg-border" />
					</div>
				)}

				{/* Completed Items */}
				{completedItems.map((item) => (
					<ItemRow key={item.id} item={item} onToggle={() => onToggleItem(item.id)} onDelete={() => setItemToDelete(item)} />
				))}
			</div>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete item?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently remove <strong className="text-foreground">"{itemToDelete?.title}"</strong> from your list.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
