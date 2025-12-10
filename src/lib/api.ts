// ===========================================
// API Service Layer
// ===========================================
// This module provides a unified API interface that can switch between
// mock data and real backend API based on environment configuration.
//
// Set NEXT_PUBLIC_USE_MOCKS=true in .env.local to use mock data
// Set NEXT_PUBLIC_USE_MOCKS=false to use real backend API

import {
	ShoppingList,
	ShoppingListSummary,
	ListItem,
	User,
	AuthUser,
	LoginCredentials,
	RegisterData,
	ApiShoppingList,
	ApiShoppingListsResponse,
	ApiItem,
} from './types';

import { apiGet, apiPost, apiPut, apiPatch, apiDelete, setAuthToken, getAuthToken, clearAuthToken, ApiClientError } from './api-client';

import { transformApiList, transformApiListToSummary, transformApiItem, transformItemToApi } from './transformers';

import {
	MOCK_CURRENT_USER,
	MOCK_USERS,
	getMockLists,
	getMockListById,
	addMockList,
	updateMockList,
	deleteMockList,
	generateListId,
	generateItemId,
	getMockUserByEmail,
} from './mock-data';
import { useAuth } from '@/contexts/auth-context';

// ===========================================
// Configuration
// ===========================================

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

// Log which mode we're using
if (typeof window !== 'undefined') {
	console.log(`[API] Running in ${USE_MOCKS ? 'MOCK' : 'REAL API'} mode`);
}

// ===========================================
// Auth API
// ===========================================

/**
 * Login user
 */
export async function login(credentials: LoginCredentials): Promise<AuthUser> {
	if (USE_MOCKS) {
		// Simulate delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Check if user exists
		const user = getMockUserByEmail(credentials.email);
		if (!user || credentials.password !== 'password123') {
			throw new Error('Invalid email or password');
		}

		const authUser: AuthUser = {
			id: parseInt(user.id),
			username: user.email.split('@')[0],
			name: user.name,
			email: user.email,
			token: `mock-token-${user.id}-${Date.now()}`,
		};

		setAuthToken(authUser.token);
		return authUser;
	}

	// Real API call
	const response = await apiPost<AuthUser, LoginCredentials>('/auth/login', credentials, { requiresAuth: false });
	setAuthToken(response.token);
	return response;
}

/**
 * Register new user
 */
export async function register(data: RegisterData): Promise<AuthUser> {
	if (USE_MOCKS) {
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Check if email already exists
		const existingUser = getMockUserByEmail(data.email);
		if (existingUser) {
			throw new Error('Email already exists');
		}

		const authUser: AuthUser = {
			id: MOCK_USERS.length + 1,
			username: data.username,
			name: data.name,
			email: data.email,
			token: `mock-token-new-${Date.now()}`,
		};

		setAuthToken(authUser.token);
		return authUser;
	}

	// Real API call
	const response = await apiPost<AuthUser, RegisterData>('/auth/register', data, { requiresAuth: false });
	setAuthToken(response.token);
	return response;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
	clearAuthToken();
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
	if (USE_MOCKS) {
		await new Promise((resolve) => setTimeout(resolve, 100));
		const token = getAuthToken();
		if (!token) return null;

		return {
			id: String(MOCK_CURRENT_USER.id),
			name: MOCK_CURRENT_USER.name,
			email: MOCK_CURRENT_USER.email,
		};
	}

	// For real API, we would need a /me endpoint
	// For now, return null if no token
	const token = getAuthToken();
	if (!token) return null;

	// You might want to add a /auth/me endpoint to your backend
	// For now, we'll return basic info from token
	return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
	return !!getAuthToken();
}

// ===========================================
// Shopping Lists API
// ===========================================

/**
 * Get all shopping lists for current user
 */
export async function getLists(): Promise<ShoppingListSummary[] | []> {
	if (USE_MOCKS) {
		await new Promise((resolve) => setTimeout(resolve, 200));

		const lists = getMockLists();
		return lists.map((list) => ({
			id: list.id,
			name: list.name,
			ownerId: String(MOCK_CURRENT_USER.id),
			itemStats: {
				total: list.items.length,
				unresolved: list.items.filter((item) => !item.completed).length,
				resolved: list.items.filter((item) => item.completed).length,
			},
			createdAt: list.createdAt,
			updatedAt: list.updatedAt,
			isArchived: list.isArchived,
			memberCount: list.members.length,
		}));
	}

	// Real API call
	try {
		const response = await apiGet<ApiShoppingListsResponse>('/shopping-lists');
		return response.items.map((list) => transformApiListToSummary(list));
	} catch (error) {
		console.error('Error fetching lists:', error);
		return [];
	}
}

/**
 * Get a single shopping list by ID
 */
export async function getListById(listId: string): Promise<ShoppingList | null> {
	if (USE_MOCKS) {
		await new Promise((resolve) => setTimeout(resolve, 200));
		return getMockListById(listId) || null;
	}

	// Real API call
	try {
		const response = await apiGet<ApiShoppingList>(`/shopping-lists/${listId}`);
		return transformApiList(response);
	} catch (error) {
		console.error('Error fetching list:', error);
		return null;
	}
}

/**
 * Create a new shopping list
 */
export async function createList(name: string): Promise<ShoppingListSummary | []> {
	if (USE_MOCKS) {
		await new Promise((resolve) => setTimeout(resolve, 300));

		const newList: ShoppingList = {
			id: generateListId(),
			name,
			createdAt: new Date(),
			updatedAt: new Date(),
			isArchived: false,
			owner: {
				id: String(MOCK_CURRENT_USER.id),
				name: MOCK_CURRENT_USER.name,
				email: MOCK_CURRENT_USER.email,
				role: 'owner',
				joinedAt: new Date(),
			},
			ownerId: String(MOCK_CURRENT_USER.id),
			members: [
				{
					id: String(MOCK_CURRENT_USER.id),
					name: MOCK_CURRENT_USER.name,
					email: MOCK_CURRENT_USER.email,
					role: 'owner',
					joinedAt: new Date(),
				},
			],
			items: [],
		};

		addMockList(newList);
		return newList;
	}

	// Real API call
	const response = await apiPost<ApiShoppingList, { name: string }>('/shopping-lists', { name });
	// console.log(response);
	// console.log(transformApiList(response));

	const newLists = await getLists();

	return newLists;
}

/**
 * Update a shopping list name
 */
export async function updateListName(listId: string, name: string): Promise<ShoppingList | null> {
	if (USE_MOCKS) {
		await new Promise((resolve) => setTimeout(resolve, 200));
		updateMockList(listId, { name });
		return getMockListById(listId) || null;
	}

	// Real API call
	const response = await apiPut<ApiShoppingList, { name: string }>(`/shopping-lists/${listId}`, { name });
	return transformApiList(response);
}

/**
 * Archive a shopping list
 */
export async function archiveList(listId: string): Promise<boolean> {
	if (USE_MOCKS) {
		await new Promise((resolve) => setTimeout(resolve, 200));
		updateMockList(listId, { isArchived: true });
		return true;
	}

	// Real API doesn't have archive endpoint, so we'll use update
	// You might want to add this endpoint to your backend
	try {
		await apiPut<ApiShoppingList, { is_archived: boolean }>(`/shopping-lists/${listId}`, { is_archived: true });
		return true;
	} catch {
		return false;
	}
}

/**
 * Unarchive a shopping list
 */
export async function unarchiveList(listId: string): Promise<boolean> {
	if (USE_MOCKS) {
		await new Promise((resolve) => setTimeout(resolve, 200));
		updateMockList(listId, { isArchived: false });
		return true;
	}

	try {
		await apiPut<ApiShoppingList, { is_archived: boolean }>(`/shopping-lists/${listId}`, { is_archived: false });
		return true;
	} catch {
		return false;
	}
}

/**
 * Delete a shopping list
 */
export async function deleteList(listId: string): Promise<boolean> {
	if (USE_MOCKS) {
		await new Promise((resolve) => setTimeout(resolve, 200));
		deleteMockList(listId);
		return true;
	}

	// Real API call
	try {
		await apiDelete<{ id: number; deleted: boolean }>(`/shopping-lists/${listId}`);
		return true;
	} catch {
		return false;
	}
}

// ===========================================
// Items API
// ===========================================

/**
 * Add item to a shopping list
 */
export async function addItem(listId: string, title: string, notes?: string): Promise<ListItem | null> {
	if (USE_MOCKS) {
		await new Promise((resolve) => setTimeout(resolve, 200));

		const list = getMockListById(listId);
		if (!list) return null;

		const newItem: ListItem = {
			id: generateItemId(),
			title,
			completed: false,
			createdAt: new Date(),
			updatedAt: new Date(),
			createdBy: MOCK_CURRENT_USER.name,
			notes,
			quantity: 1,
			unit: 'pcs',
		};

		updateMockList(listId, {
			items: [...list.items, newItem],
		});

		return newItem;
	}

	// Real API call
	const response = await apiPost<ApiItem, { name: string; quantity?: number; unit?: string }>(`/shopping-lists/${listId}/items`, {
		name: title,
		quantity: 1,
		unit: '',
	});
	return transformApiItem(response, MOCK_CURRENT_USER.name);
}

/**
 * Update an item
 */
export async function updateItem(
	listId: string,
	itemId: string,
	updates: Partial<Pick<ListItem, 'title' | 'notes' | 'completed' | 'quantity' | 'unit'>>
): Promise<ListItem | null> {
	if (USE_MOCKS) {
		await new Promise((resolve) => setTimeout(resolve, 200));

		const list = getMockListById(listId);
		if (!list) return null;

		const updatedItems = list.items.map((item) => (item.id === itemId ? { ...item, ...updates, updatedAt: new Date() } : item));

		updateMockList(listId, { items: updatedItems });

		return updatedItems.find((item) => item.id === itemId) || null;
	}

	// Real API call
	const apiUpdates: { name?: string; quantity?: number; unit?: string } = {};
	if (updates.title) apiUpdates.name = updates.title;
	if (updates.quantity) apiUpdates.quantity = updates.quantity;
	if (updates.unit) apiUpdates.unit = updates.unit;

	const response = await apiPut<ApiItem>(`/shopping-lists/${listId}/items/${itemId}`, apiUpdates);
	return transformApiItem(response);
}

/**
 * Toggle item completion status
 */
export async function toggleItemCompletion(listId: string, itemId: string): Promise<ListItem | null> {
	if (USE_MOCKS) {
		await new Promise((resolve) => setTimeout(resolve, 200));

		const list = getMockListById(listId);
		if (!list) return null;

		const item = list.items.find((i) => i.id === itemId);
		if (!item) return null;

		const updatedItems = list.items.map((i) => (i.id === itemId ? { ...i, completed: !i.completed, updatedAt: new Date() } : i));

		updateMockList(listId, { items: updatedItems });

		return updatedItems.find((i) => i.id === itemId) || null;
	}

	// Real API call - first get current state, then toggle
	const list = await getListById(listId);
	if (!list) return null;

	const item = list.items.find((i) => i.id === itemId);
	if (!item) return null;

	const response = await apiPatch<ApiItem, { is_completed: boolean }>(`/shopping-lists/${listId}/items/${itemId}/complete`, {
		is_completed: !item.completed,
	});
	return transformApiItem(response);
}

/**
 * Delete an item
 */
export async function deleteItem(listId: string, itemId: string): Promise<boolean> {
	if (USE_MOCKS) {
		await new Promise((resolve) => setTimeout(resolve, 200));

		const list = getMockListById(listId);
		if (!list) return false;

		const updatedItems = list.items.filter((item) => item.id !== itemId);
		updateMockList(listId, { items: updatedItems });

		return true;
	}

	// Real API call
	try {
		await apiDelete(`/shopping-lists/${listId}/items/${itemId}`);
		return true;
	} catch {
		return false;
	}
}

// ===========================================
// Members API
// ===========================================

/**
 * Search for a user by email (for adding members)
 */
export async function searchUserByEmail(email: string): Promise<User | null> {
	if (USE_MOCKS) {
		await new Promise((resolve) => setTimeout(resolve, 200));
		const user = getMockUserByEmail(email);
		return user || null;
	}

	// Real API call
	try {
		const response = await apiGet<{
			id: number;
			username: string;
			name: string;
			email: string;
			avatar_url?: string;
		}>(`/users/search?email=${encodeURIComponent(email)}`);

		return {
			id: String(response.id),
			name: response.name,
			email: response.email,
			avatarUrl: response.avatar_url,
		};
	} catch (error) {
		console.error('Error searching user:', error);
		return null;
	}
}

/**
 * Add member to a shopping list by email
 */
export async function addMember(listId: string, userEmail: string): Promise<ListMember | null> {
	if (USE_MOCKS) {
		await new Promise((resolve) => setTimeout(resolve, 300));

		const list = getMockListById(listId);
		if (!list) return null;

		// Check if member already exists
		if (list.members.some((m) => m.email === userEmail)) {
			throw new Error('User is already a member');
		}

		// Find user or create mock
		const existingUser = getMockUserByEmail(userEmail);
		const newMember: ListMember = existingUser
			? {
					id: existingUser.id,
					name: existingUser.name,
					email: existingUser.email,
					avatarUrl: existingUser.avatarUrl,
					role: 'member',
					joinedAt: new Date(),
			  }
			: {
					id: `user-${Date.now()}`,
					name: userEmail.split('@')[0],
					email: userEmail,
					role: 'member',
					joinedAt: new Date(),
			  };

		updateMockList(listId, {
			members: [...list.members, newMember],
		});

		return newMember;
	}

	// Real API flow:
	// 1. First, find user by email to get their ID
	const user = await searchUserByEmail(userEmail);

	if (!user) {
		throw new Error('No user found with this email address');
	}

	// 2. Add member using user ID
	try {
		const response = await apiPost<{
			shopping_list_id: number;
			members: number[];
		}>(`/shopping-lists/${listId}/members`, { user_id: parseInt(user.id) });

		// Return the new member info
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			avatarUrl: user.avatarUrl,
			role: 'member',
			joinedAt: new Date(),
		};
	} catch (error) {
		if (error instanceof ApiClientError) {
			// Rethrow with user-friendly message
			if (error.code === 'ALREADY_MEMBER') {
				throw new Error('This user is already a member of the list');
			}
			if (error.code === 'ALREADY_OWNER') {
				throw new Error('This user is the owner of the list');
			}
			throw new Error(error.message);
		}
		throw error;
	}
}

/**
 * Add member by user ID directly (for real API when you have the ID)
 */
export async function addMemberById(listId: string, userId: number): Promise<boolean> {
	if (USE_MOCKS) {
		throw new Error('Use addMember with email for mock mode');
	}

	try {
		await apiPost(`/shopping-lists/${listId}/members`, { user_id: userId });
		return true;
	} catch {
		return false;
	}
}

/**
 * Remove member from a shopping list
 */
export async function removeMember(listId: string, memberId: string): Promise<boolean> {
	if (USE_MOCKS) {
		await new Promise((resolve) => setTimeout(resolve, 200));

		const list = getMockListById(listId);
		if (!list) return false;

		const updatedMembers = list.members.filter((m) => m.id !== memberId);
		updateMockList(listId, { members: updatedMembers });

		return true;
	}

	// Real API call
	try {
		await apiDelete(`/shopping-lists/${listId}/members/${memberId}`);
		return true;
	} catch {
		return false;
	}
}

/**
 * Leave a shopping list (current user removes themselves)
 */
export async function leaveList(listId: string): Promise<boolean> {
	if (USE_MOCKS) {
		await new Promise((resolve) => setTimeout(resolve, 200));

		const list = getMockListById(listId);
		if (!list) return false;

		const updatedMembers = list.members.filter((m) => m.id !== String(MOCK_CURRENT_USER.id));
		updateMockList(listId, { members: updatedMembers });

		return true;
	}

	// Real API call
	return removeMember(listId, String(MOCK_CURRENT_USER.id));
}

// ===========================================
// Utility Exports
// ===========================================

export { USE_MOCKS, setAuthToken, getAuthToken, clearAuthToken };
