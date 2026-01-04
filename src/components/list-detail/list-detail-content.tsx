'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, Plus, Loader2, ShoppingCart, CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';
import { ListHeader } from './list-header';
import { MembersSection } from './members-section';
import { EmptyState } from './empty-state';
import { AddItemDialog } from './dialogs/add-item-dialog';
import { AddMemberDialog } from './dialogs/add-member-dialog';
import { UpdateListDialog } from './dialogs/update-list-dialog';
import { ShoppingList } from '@/lib/types';
import { getListById, updateListName, addItem, toggleItemCompletion, deleteItem, removeMember } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ItemsList } from './item-list';
import { useAuth } from '@/contexts/auth-context';
import { ListDetailItemsChart } from '@/components/charts/list-detail-items-chart';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

type TabValue = 'unresolved' | 'all' | 'resolved';

export function ListDetailContent({ listId }: { listId: string }) {
	const { t } = useTranslation();
	const [listData, setListData] = useState<ShoppingList | null>(null);
	const [activeTab, setActiveTab] = useState<TabValue>('unresolved');
	const [isAddItemOpen, setIsAddItemOpen] = useState(false);
	const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
	const [isUpdateListOpen, setIsUpdateListOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	const auth = useAuth();

	useEffect(() => {
		loadList();
	}, [listId]);

	const loadList = async () => {
		try {
			setIsLoading(true);
			const data = await getListById(listId);

			if (!data) {
				toast.error(t('listDetail.toast.noAccess'));
				router.push('/');
				return;
			}

			setListData(data);
		} catch (error) {
			toast.error(t('listDetail.toast.failedToLoad'));
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading || !listData) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
			</div>
		);
	}

	const filteredItems = listData.items.filter((item) => {
		if (activeTab === 'unresolved') return !item.completed;
		if (activeTab === 'resolved') return item.completed;
		return true;
	});

	const handleToggleItem = async (itemId: string) => {
		try {
			const updatedItem = await toggleItemCompletion(listId, itemId);
			if (updatedItem) {
				setListData((prev) =>
					prev
						? {
								...prev,
								items: prev.items.map((item) => (item.id === itemId ? updatedItem : item)),
						  }
						: prev
				);
			}
		} catch (error) {
			toast.error(t('listDetail.toast.failedToUpdateItem'));
		}
	};

	const handleDeleteItem = async (itemId: string) => {
		try {
			const success = await deleteItem(listId, itemId);
			if (success) {
				setListData((prev) =>
					prev
						? {
								...prev,
								items: prev.items.filter((item) => item.id !== itemId),
						  }
						: prev
				);
				toast.success(t('listDetail.toast.itemDeleted'));
			}
		} catch (error) {
			toast.error(t('listDetail.toast.failedToDeleteItem'));
		}
	};

	const handleRemoveMember = async (memberId: string) => {
		try {
			const success = await removeMember(listId, memberId);
			if (success) {
				setListData((prev) =>
					prev
						? {
								...prev,
								members: prev.members.filter((m) => m.id !== memberId),
						  }
						: prev
				);
				toast.success(t('listDetail.toast.memberRemoved'));
			}
		} catch (error) {
			toast.error(t('listDetail.toast.failedToRemoveMember'));
		}
	};

	const handleAddItem = async (title: string, notes?: string) => {
		try {
			const newItem = await addItem(listId, title, notes);
			if (newItem) {
				setListData((prev) =>
					prev
						? {
								...prev,
								items: [...prev.items, newItem],
						  }
						: prev
				);
				toast.success(`"${title}" ${t('listDetail.toast.itemAdded')}`);
			}
		} catch (error) {
			toast.error(t('listDetail.toast.failedToAddItem'));
		}
	};

	const handleUpdateList = async (name: string) => {
		try {
			const updated = await updateListName(listId, name);
			if (updated) {
				setListData(updated);
				toast.success(t('listDetail.toast.listNameUpdated'));
			}
		} catch (error) {
			toast.error(t('listDetail.toast.failedToUpdateList'));
		}
	};

	const isOwner = listData.owner.id === String(auth.user?.id);

	const totalItems = listData.items.length;
	const completedItems = listData.items.filter((item) => item.completed).length;
	const pendingItems = totalItems - completedItems;
	const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

	return (
		<main className="min-h-screen bg-background">
			<div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="space-y-6">
					{/* Back Navigation */}
					<Link
						href="/"
						className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
						aria-label={t('listDetail.backToLists')}
					>
						<ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
						<span>{t('listDetail.backToLists')}</span>
					</Link>

					{/* List Header */}
					<ListHeader
						name={listData.name}
						isOwner={isOwner}
						isArchived={listData.isArchived}
						createdAt={listData.createdAt}
						updatedAt={listData.updatedAt}
						onUpdate={() => setIsUpdateListOpen(true)}
					/>

					{/* Progress Overview Bar */}
					{totalItems > 0 && (
						<div className="rounded-lg border bg-card p-4 space-y-3">
							<div className="flex items-center justify-between text-sm">
								<div className="flex items-center gap-6">
									<div className="flex items-center gap-2">
										<ShoppingCart className="h-4 w-4 text-muted-foreground" />
										<span className="font-medium">{totalItems}</span>
										<span className="text-muted-foreground">
											{totalItems === 1 ? t('listDetail.progress.item') : t('listDetail.progress.items')}
										</span>
									</div>
									<div className="h-4 w-px bg-border" />
									<div className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-green-600" />
										<span className="font-medium">{completedItems}</span>
										<span className="text-muted-foreground">{t('listDetail.progress.completed')}</span>
									</div>
									<div className="h-4 w-px bg-border" />
									<div className="flex items-center gap-2">
										<Circle className="h-4 w-4 text-amber-600" />
										<span className="font-medium">{pendingItems}</span>
										<span className="text-muted-foreground">{t('listDetail.progress.pending')}</span>
									</div>
								</div>
								<Badge variant="secondary" className="text-sm font-semibold">
									{completionRate}% {t('listDetail.progress.complete')}
								</Badge>
							</div>
							<Progress value={completionRate} className="h-2" />
						</div>
					)}

					{/* Members Section */}
					<MembersSection
						owner={listData.owner}
						isOwner={isOwner}
						members={listData.members}
						onRemoveMember={handleRemoveMember}
						onAddMember={() => setIsAddMemberOpen(true)}
					/>

					{/* Chart */}
					{listData.items.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle>{t('listDetail.chart.title')}</CardTitle>
								<CardDescription>{t('listDetail.chart.description')}</CardDescription>
							</CardHeader>
							<CardContent>
								<ListDetailItemsChart items={listData.items} />
							</CardContent>
						</Card>
					)}

					<div className="space-y-6">
						<div className="flex items-center justify-between gap-4">
							<Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className="w-full">
								<TabsList className="grid w-full max-w-md grid-cols-3">
									<TabsTrigger value="unresolved" className="relative">
										{t('listDetail.tabs.unresolved')}
										{listData.items.filter((i) => !i.completed).length > 0 && (
											<span className="ml-2 rounded-full bg-zinc-900 px-2 py-0.5 text-xs text-white">
												{listData.items.filter((i) => !i.completed).length}
											</span>
										)}
									</TabsTrigger>
									<TabsTrigger value="all">{t('listDetail.tabs.all')}</TabsTrigger>
									<TabsTrigger value="resolved">
										{t('listDetail.tabs.resolved')}
										{listData.items.filter((i) => i.completed).length > 0 && (
											<span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
												{listData.items.filter((i) => i.completed).length}
											</span>
										)}
									</TabsTrigger>
								</TabsList>
							</Tabs>

							<Button onClick={() => setIsAddItemOpen(true)} className="shrink-0 gap-2 shadow-sm" size="sm">
								<Plus className="h-4 w-4" />
								<span className="hidden sm:inline">{t('listDetail.addItem')}</span>
							</Button>
						</div>

						{filteredItems.length === 0 ? (
							<EmptyState tab={activeTab} onAddItem={() => setIsAddItemOpen(true)} />
						) : (
							<ItemsList items={filteredItems} onToggleItem={handleToggleItem} onDeleteItem={handleDeleteItem} />
						)}
					</div>
				</div>
			</div>

			<AddItemDialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen} onAdd={handleAddItem} />
			<AddMemberDialog
				listId={listData.id}
				open={isAddMemberOpen}
				onOpenChange={setIsAddMemberOpen}
				onMemberAdded={(member) => {
					setListData((prev) =>
						prev
							? {
									...prev,
									members: [...prev.members, member],
							  }
							: prev
					);
				}}
				existingEmails={listData.members.map((m) => m.email)}
			/>
			{/* <AddMemberDialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen} /> */}
			<UpdateListDialog open={isUpdateListOpen} onOpenChange={setIsUpdateListOpen} currentName={listData.name} onUpdate={handleUpdateList} />
		</main>
	);
}
