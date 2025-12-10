'use client';

import { useState } from 'react';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
import { Calendar, MoreVertical, Archive, Trash2, Users, ArchiveRestore, ExternalLink, Crown, User } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ShoppingListSummary } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Progress } from '../ui/progress';
import { useAuth } from '@/contexts/auth-context';

type ListCardProps = {
	list: ShoppingListSummary;
	onArchive?: (listId: string) => void;
	onUnarchive?: (listId: string) => void;
	onDelete: (listId: string) => void;
};

export function ListCard({ list, onArchive, onUnarchive, onDelete }: ListCardProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showArchiveDialog, setShowArchiveDialog] = useState(false);

	// Auth
	const auth = useAuth();

	const handleDelete = () => {
		onDelete(list.id);
		setShowDeleteDialog(false);
	};

	const handleArchive = () => {
		if (list.isArchived && onUnarchive) {
			onUnarchive(list.id);
		} else if (onArchive) {
			onArchive(list.id);
		}
		setShowArchiveDialog(false);
	};

	const completionPercentage = list.itemStats.total > 0 ? Math.round((list.itemStats.resolved / list.itemStats.total) * 100) : 0;
	const isOwner = list.ownerId === auth.user?.id;

	return (
		<>
			<Card className="group">
				{/* Header */}
				<CardHeader>
					<CardTitle>{list.name}</CardTitle>
					<CardDescription className={'inline-flex gap-2'}>
						{isOwner ? <Badge>Owner</Badge> : <Badge variant={'secondary'}>Member</Badge>}

						{list.isArchived && (
							<Badge variant={'outline'}>
								<Archive />
								Archived
							</Badge>
						)}
					</CardDescription>

					<CardAction>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
									aria-label="List actions"
								>
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem asChild>
									<Link href={`/lists/${list.id}`} className="cursor-pointer">
										Open List
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								{isOwner && (
									<>
										<DropdownMenuItem onClick={() => setShowArchiveDialog(true)} className="cursor-pointer">
											{list.isArchived ? (
												<>
													<ArchiveRestore className="mr-2 h-4 w-4" />
													Unarchive
												</>
											) : (
												<>
													<Archive className="mr-2 h-4 w-4" />
													Archive
												</>
											)}
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={() => setShowDeleteDialog(true)}
											className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
										>
											<Trash2 className="mr-2 h-4 w-4" />
											Delete
										</DropdownMenuItem>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</CardAction>
				</CardHeader>

				{/* Content */}
				<CardContent className="space-y-3">
					<div className="space-y-1">
						<div className="flex items-center justify-between text-xs">
							<span>Progress</span>
							<span>{completionPercentage}%</span>
						</div>
						<Progress value={completionPercentage} />
					</div>

					<div className="grid grid-cols-3 gap-2 rounded-xl bg-background p-3 inset-shadow-xs shadow-md">
						<div className="space-y-1 text-center">
							<div className="text-xs text-zinc-600">Total</div>
							<div className="text-lg font-semibold text-zinc-900">{list.itemStats.total}</div>
						</div>
						<div className="space-y-1 border-x border-zinc-200 text-center">
							<div className="text-xs text-zinc-600">Pending</div>
							<div className="text-lg font-semibold text-amber-600">{list.itemStats.unresolved}</div>
						</div>
						<div className="space-y-1 text-center">
							<div className="text-xs text-zinc-600">Done</div>
							<div className="text-lg font-semibold text-green-600">{list.itemStats.resolved}</div>
						</div>
					</div>
				</CardContent>

				{/* Footer */}
				<CardFooter className="flex flex-col border-t gap-4">
					{/* Stats */}
					<div className="flex items-center justify-between text-xs text-zinc-500 w-full">
						<div className="flex items-center gap-1">
							<Calendar size={'14'} />
							<span>
								{formatDistanceToNow(list.updatedAt, {
									addSuffix: true,
								})}
							</span>
						</div>

						<div className="flex items-center gap-1">
							<Users size={'14'} />
							<span>
								{list.memberCount} member
								{list.memberCount !== 1 ? 's' : ''}
							</span>
						</div>
					</div>

					{/* Open Button */}
					<Button asChild size={'sm'} className="w-full font-light" variant={'secondary'}>
						<Link href={`/lists/${list.id}`}>Open</Link>
					</Button>
				</CardFooter>
			</Card>

			{/* Delete Confirmation */}
			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Shopping List</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete <strong>"{list.name}"</strong>? This will permanently remove the list and all its items.
							This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
							Delete List
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Archive/Unarchive Confirmation */}
			<AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{list.isArchived ? 'Unarchive' : 'Archive'} List</AlertDialogTitle>
						<AlertDialogDescription>
							{list.isArchived ? (
								<>
									Are you sure you want to restore <strong>"{list.name}"</strong> from the archive? It will appear in your active
									lists again.
								</>
							) : (
								<>
									Are you sure you want to archive <strong>"{list.name}"</strong>? You can restore it later from the Archived tab.
								</>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleArchive}>{list.isArchived ? 'Unarchive' : 'Archive'}</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
