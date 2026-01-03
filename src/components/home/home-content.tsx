'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, ShoppingBag, Archive, X } from 'lucide-react';
import { ListCard } from './list-card';
import { CreateListDialog } from './dialogs/create-list-dialog';
import { EmptyListsState } from './empty-list-state';
import { useLists } from '@/hooks/use-shopping-lists';
import { Spinner } from '../ui/spinner';
import { toast } from 'sonner';
import ListGrid from './list-grid';
import { DashboardListSummaryChart } from '@/components/charts/dashboard-list-summary-chart';

type TabValue = 'active' | 'archived';

export function HomeContent() {
	const [activeTab, setActiveTab] = useState<TabValue>('active');
	const [searchQuery, setSearchQuery] = useState('');
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	// Use the hook - lists is always an array now
	const { lists, isLoading, createNewList, archiveListById, unarchiveListById, deleteListById } = useLists();

	// Computed values - safe because lists is always []
	const activeLists = useMemo(() => lists.filter((l) => !l.isArchived), [lists]);
	const archivedLists = useMemo(() => lists.filter((l) => l.isArchived), [lists]);

	const filteredLists = useMemo(() => {
		const sourceList = activeTab === 'active' ? activeLists : archivedLists;

		if (!searchQuery.trim()) {
			return sourceList;
		}

		const query = searchQuery.toLowerCase();
		return sourceList.filter((list) => list.name.toLowerCase().includes(query));
	}, [activeLists, archivedLists, activeTab, searchQuery]);

	// Stats for header
	const pendingItems = useMemo(() => activeLists.reduce((sum, list) => sum + list.itemStats.unresolved, 0), [activeLists]);

	const clearSearch = () => setSearchQuery('');

	// Handlers with toast notifications
	const handleCreateList = async (name: string) => {
		const result = await createNewList(name);
		if (result) {
			toast.success(`"${name}" created`);
			setIsCreateDialogOpen(false);
		} else {
			toast.error('Failed to create list');
		}
	};

	const handleArchive = async (id: string) => {
		const list = lists.find((l) => l.id === id);
		const success = await archiveListById(id);
		if (success) {
			toast.success(`"${list?.name}" archived`);
		} else {
			toast.error('Failed to archive list');
		}
	};

	const handleUnarchive = async (id: string) => {
		const list = lists.find((l) => l.id === id);
		const success = await unarchiveListById(id);
		if (success) {
			toast.success(`"${list?.name}" restored`);
		} else {
			toast.error('Failed to restore list');
		}
	};

	const handleDelete = async (id: string) => {
		const list = lists.find((l) => l.id === id);
		const success = await deleteListById(id);
		if (success) {
			toast.success(`"${list?.name}" deleted`);
		} else {
			toast.error('Failed to delete list');
		}
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
				<Spinner className="size-6 text-primary" />
				<p className="text-sm text-muted-foreground">Loading your lists...</p>
			</div>
		);
	}

	return (
		<main className="min-h-[calc(100vh-4rem)] bg-background">
			<div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="space-y-6">
					{/* Header */}
					<header className="space-y-1">
						<h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Shopping Lists</h1>
						{activeLists.length > 0 && (
							<p className="text-sm text-muted-foreground">
								{pendingItems > 0 ? (
									<>
										<span className="font-medium text-foreground">{pendingItems}</span>
										{' items to buy across '}
										<span className="font-medium text-foreground">{activeLists.length}</span>
										{' lists'}
									</>
								) : (
									'All caught up! 🎉'
								)}
							</p>
						)}
					</header>

					{/* Lists Overview Chart */}
					{activeLists.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle>Lists Overview</CardTitle>
							</CardHeader>
							<CardContent>
								<DashboardListSummaryChart lists={activeLists} />
							</CardContent>
						</Card>
					)}

					{/* Toolbar */}
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						{/* Search */}
						<div className="relative w-full sm:max-w-xs">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								type="text"
								placeholder="Search lists..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9 pr-9"
							/>
							{searchQuery && (
								<button
									onClick={clearSearch}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
									aria-label="Clear search"
								>
									<X className="h-4 w-4" />
								</button>
							)}
						</div>

						{/* Create button */}
						<Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
							<Plus className="h-4 w-4" />
							New List
						</Button>
					</div>

					{/* Search results indicator */}
					{searchQuery && (
						<p className="text-sm text-muted-foreground">
							{filteredLists.length} result{filteredLists.length !== 1 && 's'}
						</p>
					)}

					{/* Tabs */}
					<Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
						<TabsList>
							<TabsTrigger value="active">
								<ShoppingBag className="mr-2 h-4 w-4" />
								Active
								{activeLists.length > 0 && (
									<Badge variant="secondary" className="ml-2">
										{activeLists.length}
									</Badge>
								)}
							</TabsTrigger>
							<TabsTrigger value="archived">
								<Archive className="mr-2 h-4 w-4" />
								Archived
								{archivedLists.length > 0 && (
									<Badge variant="outline" className="ml-2">
										{archivedLists.length}
									</Badge>
								)}
							</TabsTrigger>
						</TabsList>

						{/* Active Lists */}
						<TabsContent value="active" className="mt-6">
							{filteredLists.length === 0 ? (
								<EmptyListsState
									type="active"
									hasSearch={searchQuery.length > 0}
									onCreateList={() => setIsCreateDialogOpen(true)}
									onClearSearch={clearSearch}
								/>
							) : (
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
									{filteredLists.map((list) => (
										<ListCard
											key={list.id}
											list={list}
											onArchive={() => handleArchive(list.id)}
											onDelete={() => handleDelete(list.id)}
										/>
									))}
								</div>
							)}
						</TabsContent>

						{/* Archived Lists */}
						<TabsContent value="archived" className="mt-6">
							{filteredLists.length === 0 ? (
								<EmptyListsState type="archived" hasSearch={searchQuery.length > 0} onClearSearch={clearSearch} />
							) : (
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
									{filteredLists.map((list) => (
										<ListCard
											key={list.id}
											list={list}
											onUnarchive={() => handleUnarchive(list.id)}
											onDelete={() => handleDelete(list.id)}
										/>
									))}
								</div>
							)}
						</TabsContent>
					</Tabs>
				</div>
			</div>

			{/* Create Dialog */}
			<CreateListDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onCreate={handleCreateList} />
		</main>
	);
}
