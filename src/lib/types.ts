// ===========================================
// Frontend Types (used in components)
// ===========================================

// User types
export type UserRole = 'owner' | 'member';

export type User = {
	id: string;
	name: string;
	email: string;
	avatarUrl?: string;
	role?: UserRole;
};

// List Member types
export type ListMember = User & {
	role?: UserRole;
	joinedAt?: Date;
};

// Item types
export type ListItem = {
	id: string;
	title: string;
	completed: boolean;
	createdAt: Date;
	updatedAt: Date;
	createdBy: string;
	notes?: string;
	quantity?: number;
	unit?: string;
};

// Shopping List types
export type ShoppingList = {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	isArchived: boolean;
	ownerId: string;
	owner: User;
	members: ListMember[];
	items: ListItem[];
};

// List Summary (for home page cards)
export type ShoppingListSummary = {
	id: string;
	name: string;
	ownerId: string;
	itemStats: {
		total: number;
		unresolved: number;
		resolved: number;
	};
	createdAt: Date;
	updatedAt: Date;
	isArchived: boolean;
	memberCount: number;
};

// Auth types
export type AuthUser = {
	id: number;
	username: string;
	name: string;
	email: string;
	token: string;
	avatarUrl: string;
};

export type LoginCredentials = {
	email: string;
	password: string;
};

export type RegisterData = {
	username: string;
	name: string;
	email: string;
	password: string;
};

// ===========================================
// Backend API Types (raw responses from API)
// ===========================================

export type ApiUser = {
	id: number;
	username: string;
	name: string;
	email: string;
	avatar_url?: string;
	role?: string;
};

export type ApiItem = {
	id: number;
	name: string;
	quantity: number;
	unit: string;
	is_completed: boolean;
	due_date: string | null;
};

export type ApiShoppingList = {
	id: number;
	name: string;
	owner_id: number;
	owner: ApiUser;
	members: ApiUser[];
	is_archived: boolean;
	is_active: boolean;
	item_list: ApiItem[];
	itemCount?: number;
};

export type ApiShoppingListsResponse = {
	items: ApiShoppingList[];
};

export type ApiMembersResponse = {
	shopping_list_id: number;
	owner_id: number;
	members: number[];
};

export type ApiError = {
	error?: {
		code: string;
		message: string;
	};
	errors?: Array<{
		field: string;
		message: string;
		code: string;
	}>;
};
