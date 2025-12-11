'use client';

// ===========================================
// Shopping List Hooks
// ===========================================
// Custom React hooks for managing shopping list state

import { useState, useEffect, useCallback } from 'react';
import {
	getLists,
	getListById,
	createList,
	updateListName,
	archiveList,
	unarchiveList,
	deleteList,
	addItem,
	updateItem,
	toggleItemCompletion,
	deleteItem,
	addMember,
	removeMember,
} from '@/lib/api';
import { ShoppingList, ShoppingListSummary, ListItem, User } from '@/lib/types';
import { toast } from 'sonner';

// ===========================================
// useLists - Fetch all shopping lists
// ===========================================

interface UseListsReturn {
	lists: ShoppingListSummary[] | [];
	isLoading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
	createNewList: (name: string) => Promise<ShoppingList | []>;
	archiveListById: (id: string) => Promise<boolean>;
	unarchiveListById: (id: string) => Promise<boolean>;
	deleteListById: (id: string) => Promise<boolean>;
}

export function useLists(): UseListsReturn {
	const [lists, setLists] = useState<ShoppingListSummary[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchLists = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const data = await getLists();
			setLists(data || []);
			// console.log(data);
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Failed to fetch lists'));
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchLists();
	}, [fetchLists]);

	const createNewList = useCallback(
		async (name: string): Promise<ShoppingList | []> => {
			try {
				const newList = await createList(name);
				await fetchLists(); // Refetch to update the list
				return newList;
			} catch (err) {
				setError(err instanceof Error ? err : new Error('Failed to create list'));
				return [];
			}
		},
		[fetchLists]
	);

	const archiveListById = useCallback(
		async (id: string): Promise<boolean> => {
			try {
				const success = await archiveList(id);
				if (success) {
					await fetchLists();
				}
				return success;
			} catch (err) {
				setError(err instanceof Error ? err : new Error('Failed to archive list'));
				return false;
			}
		},
		[fetchLists]
	);

	const unarchiveListById = useCallback(
		async (id: string): Promise<boolean> => {
			try {
				const success = await unarchiveList(id);
				if (success) {
					await fetchLists();
				}
				return success;
			} catch (err) {
				setError(err instanceof Error ? err : new Error('Failed to unarchive list'));
				return false;
			}
		},
		[fetchLists]
	);

	const deleteListById = useCallback(
		async (id: string): Promise<boolean> => {
			try {
				const success = await deleteList(id);
				if (success) {
					await fetchLists();
				}
				return success;
			} catch (err) {
				setError(err instanceof Error ? err : new Error('Failed to delete list'));
				return false;
			}
		},
		[fetchLists]
	);

	return {
		lists,
		isLoading,
		error,
		refetch: fetchLists,
		createNewList,
		archiveListById,
		unarchiveListById,
		deleteListById,
	};
}

// ===========================================
// useList - Fetch single shopping list
// ===========================================

interface UseListReturn {
	list: ShoppingList | null;
	isLoading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
	updateName: (name: string) => Promise<boolean>;
	// Item operations
	addNewItem: (title: string, notes?: string) => Promise<ListItem | null>;
	updateExistingItem: (itemId: string, updates: Partial<ListItem>) => Promise<ListItem | null>;
	toggleItem: (itemId: string) => Promise<ListItem | null>;
	removeItem: (itemId: string) => Promise<boolean>;
	// Member operations
	addNewMember: (email: string) => Promise<User | null>;
	removeMemberById: (memberId: string) => Promise<boolean>;
}

export function useList(listId: string): UseListReturn {
	const [list, setList] = useState<ShoppingList | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchList = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const data = await getListById(listId);
			setList(data);
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Failed to fetch list'));
		} finally {
			setIsLoading(false);
		}
	}, [listId]);

	useEffect(() => {
		fetchList();
	}, [fetchList]);

	const updateName = useCallback(
		async (name: string): Promise<boolean> => {
			try {
				const updated = await updateListName(listId, name);
				if (updated) {
					setList(updated);
					return true;
				}
				return false;
			} catch (err) {
				setError(err instanceof Error ? err : new Error('Failed to update list name'));
				return false;
			}
		},
		[listId]
	);

	// Item operations
	const addNewItem = useCallback(
		async (title: string, notes?: string): Promise<ListItem | null> => {
			try {
				const item = await addItem(listId, title, notes);
				if (item) {
					await fetchList();
				}
				return item;
			} catch (err) {
				setError(err instanceof Error ? err : new Error('Failed to add item'));
				return null;
			}
		},
		[listId, fetchList]
	);

	const updateExistingItem = useCallback(
		async (itemId: string, updates: Partial<ListItem>): Promise<ListItem | null> => {
			try {
				const item = await updateItem(listId, itemId, updates);
				if (item) {
					await fetchList();
				}
				return item;
			} catch (err) {
				setError(err instanceof Error ? err : new Error('Failed to update item'));
				return null;
			}
		},
		[listId, fetchList]
	);

	const toggleItem = useCallback(
		async (itemId: string): Promise<ListItem | null> => {
			try {
				const item = await toggleItemCompletion(listId, itemId);
				if (item) {
					// Optimistic update
					setList((prev) => {
						if (!prev) return prev;
						return {
							...prev,
							items: prev.items.map((i) => (i.id === itemId ? { ...i, completed: !i.completed } : i)),
						};
					});
				}
				return item;
			} catch (err) {
				setError(err instanceof Error ? err : new Error('Failed to toggle item'));
				await fetchList(); // Revert on error
				return null;
			}
		},
		[listId, fetchList]
	);

	const removeItem = useCallback(
		async (itemId: string): Promise<boolean> => {
			try {
				const success = await deleteItem(listId, itemId);
				if (success) {
					// Optimistic update
					setList((prev) => {
						if (!prev) return prev;
						return {
							...prev,
							items: prev.items.filter((i) => i.id !== itemId),
						};
					});
				}
				return success;
			} catch (err) {
				setError(err instanceof Error ? err : new Error('Failed to delete item'));
				await fetchList(); // Revert on error
				return false;
			}
		},
		[listId, fetchList]
	);

	// Member operations
	const addNewMember = useCallback(
		async (email: string): Promise<User | null> => {
			try {
				const member = await addMember(listId, email);
				if (member) {
					await fetchList();
				}
				return member;
			} catch (err) {
				setError(err instanceof Error ? err : new Error('Failed to add member'));
				return null;
			}
		},
		[listId, fetchList]
	);

	const removeMemberById = useCallback(
		async (memberId: string): Promise<boolean> => {
			try {
				const success = await removeMember(listId, memberId);
				if (success) {
					await fetchList();
				}
				return success;
			} catch (err) {
				setError(err instanceof Error ? err : new Error('Failed to remove member'));
				return false;
			}
		},
		[listId, fetchList]
	);

	return {
		list,
		isLoading,
		error,
		refetch: fetchList,
		updateName,
		addNewItem,
		updateExistingItem,
		toggleItem,
		removeItem,
		addNewMember,
		removeMemberById,
	};
}
