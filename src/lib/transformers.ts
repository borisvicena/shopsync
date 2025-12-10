// ===========================================
// Data Transformers
// ===========================================
// Functions to convert between backend API format and frontend types

import { ShoppingList, ShoppingListSummary, ListItem, User, ApiShoppingList, ApiItem, ApiUser } from './types';

// ===========================================
// API -> Frontend Transformers
// ===========================================

/**
 * Transform API item to frontend ListItem
 */
export function transformApiItem(apiItem: ApiItem, createdBy?: string): ListItem {
	return {
		id: String(apiItem.id),
		title: apiItem.name,
		completed: apiItem.is_completed,
		createdAt: new Date(),
		updatedAt: new Date(),
		createdBy: createdBy || 'Unknown',
		notes: undefined,
		quantity: apiItem.quantity,
		unit: apiItem.unit || undefined,
	};
}

/**
 * Transform API shopping list to frontend ShoppingList
 */
export function transformApiList(apiList: ApiShoppingList, members: User[] = [], currentUserId?: string): ShoppingList {
	const ownerId = String(apiList.owner_id);

	console.log(apiList, members, currentUserId);

	return {
		id: String(apiList.id),
		name: apiList.name,
		createdAt: new Date(),
		updatedAt: new Date(),
		isArchived: apiList.is_archived,
		ownerId: ownerId,
		owner: transformApiUser(apiList.owner),
		members: (apiList.members || []).map((item) => transformApiUser(item)),
		items: (apiList.item_list || []).map((item) => transformApiItem(item)),
	};
}

/**
 * Transform API shopping list to ShoppingListSummary
 */
export function transformApiListToSummary(apiList: ApiShoppingList): ShoppingListSummary {
	// const isOwner = String(apiList.owner_id);
	// const isMember = apiList.members.map(String).includes(currentUserId);

	const items = apiList.item_list || [];
	const totalItems = apiList.itemCount ?? items.length;
	const completedItems = items.filter((item) => item.is_completed).length;

	return {
		id: String(apiList.id),
		name: apiList.name,
		ownerId: String(apiList.owner_id),
		role: null,
		// role: isOwner ? 'owner' : 'member',
		itemStats: {
			total: totalItems,
			unresolved: totalItems - completedItems,
			resolved: completedItems,
		},
		createdAt: new Date(),
		updatedAt: new Date(),
		isArchived: apiList.is_archived,
		memberCount: apiList.members.length + 1, // +1 for owner
	};
}

/**
 * Transform API user to frontend User
 */
export function transformApiUser(apiUser: ApiUser): User {
	return {
		id: String(apiUser.id),
		name: apiUser.name,
		email: apiUser.email,
		avatarUrl: apiUser.avatar_url || undefined,
	};
}

// ===========================================
// Frontend -> API Transformers
// ===========================================

/**
 * Transform frontend ListItem to API item format for creation
 */
export function transformItemToApi(item: Partial<ListItem>): {
	name: string;
	quantity?: number;
	unit?: string;
	due_date?: string | null;
} {
	return {
		name: item.title || '',
		quantity: item.quantity || 1,
		unit: item.unit || '',
		due_date: null,
	};
}

/**
 * Transform frontend item update to API format
 */
export function transformItemUpdateToApi(updates: Partial<ListItem>): {
	name?: string;
	quantity?: number;
	unit?: string;
	due_date?: string | null;
} {
	const apiUpdates: {
		name?: string;
		quantity?: number;
		unit?: string;
		due_date?: string | null;
	} = {};

	if (updates.title !== undefined) {
		apiUpdates.name = updates.title;
	}
	if (updates.quantity !== undefined) {
		apiUpdates.quantity = updates.quantity;
	}
	if (updates.unit !== undefined) {
		apiUpdates.unit = updates.unit;
	}

	return apiUpdates;
}

// ===========================================
// Helper Functions
// ===========================================

/**
 * Build member list from member IDs and user data
 */
export function buildMemberList(ownerId: number, memberIds: number[], usersMap: Map<number, ApiUser>, ownerUser?: ApiUser): User[] {
	const members: User[] = [];

	// Add owner
	const owner = ownerUser || usersMap.get(ownerId);
	if (owner) {
		members.push({
			id: String(owner.id),
			name: owner.name,
			email: owner.email,
			avatarUrl: owner.avatar_url || undefined,
		});
	} else {
		members.push({
			id: String(ownerId),
			name: 'Owner',
			email: '',
		});
	}

	// Add members
	for (const memberId of memberIds) {
		const user = usersMap.get(memberId);
		if (user) {
			members.push({
				id: String(user.id),
				name: user.name,
				email: user.email,
				avatarUrl: user.avatar_url || undefined,
			});
		}
	}

	return members;
}
