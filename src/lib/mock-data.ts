// ===========================================
// Mock Data for Development
// ===========================================
// This file contains mock data that mirrors the backend API structure
// Used when NEXT_PUBLIC_USE_MOCKS=true

import { ShoppingList, User, ListItem, ListMember, AuthUser } from './types';

// ===========================================
// Mock Users
// ===========================================

export const MOCK_USERS: User[] = [
	{
		id: '1',
		name: 'Demo User',
		email: 'demo@example.com',
		avatarUrl: undefined,
	},
	{
		id: '2',
		name: 'Jane Smith',
		email: 'jane@example.com',
		avatarUrl: undefined,
	},
	{
		id: '3',
		name: 'Bob Wilson',
		email: 'bob@example.com',
		avatarUrl: undefined,
	},
	{
		id: '4',
		name: 'Alice Johnson',
		email: 'alice@example.com',
		avatarUrl: undefined,
	},
	{
		id: '5',
		name: 'Charlie Brown',
		email: 'charlie@example.com',
		avatarUrl: undefined,
	},
];

// Current logged in user (for mock mode)
export const MOCK_CURRENT_USER: AuthUser = {
	id: 1,
	username: 'demouser',
	name: 'Demo User',
	email: 'demo@example.com',
	token: 'mock-jwt-token-12345',
	avatarUrl: '',
};

// ===========================================
// Mock Shopping Lists
// ===========================================

export const MOCK_LISTS: ShoppingList[] = [
	{
		id: '1',
		name: 'Weekly Groceries',
		createdAt: new Date('2025-01-15T10:00:00'),
		updatedAt: new Date('2025-01-20T14:30:00'),
		isArchived: false,
		ownerId: '1',
		owner: {
			id: '1',
			name: 'Charlie Brown',
			email: 'charlie@example.com',
			avatarUrl: undefined,
		},
		members: [
			{
				id: '1',
				name: 'Demo User',
				email: 'demo@example.com',
				role: 'owner',
			},
			{
				id: '2',
				name: 'Jane Smith',
				email: 'jane@example.com',
				role: 'member',
			},
		],
		items: [
			{
				id: '1',
				title: 'Organic Milk',
				completed: false,
				createdAt: new Date('2025-01-15T10:30:00'),
				updatedAt: new Date('2025-01-15T10:30:00'),
				createdBy: 'Demo User',
				notes: '2 gallons, whole milk',
				quantity: 2,
				unit: 'gal',
			},
			{
				id: '2',
				title: 'Fresh Bread',
				completed: false,
				createdAt: new Date('2025-01-15T11:00:00'),
				updatedAt: new Date('2025-01-15T11:00:00'),
				createdBy: 'Jane Smith',
				notes: 'Sourdough if available',
				quantity: 1,
				unit: 'loaf',
			},
			{
				id: '3',
				title: 'Eggs',
				completed: true,
				createdAt: new Date('2025-01-15T10:45:00'),
				updatedAt: new Date('2025-01-16T08:00:00'),
				createdBy: 'Demo User',
				notes: '12 pack, free range',
				quantity: 12,
				unit: 'pcs',
			},
			{
				id: '4',
				title: 'Bananas',
				completed: true,
				createdAt: new Date('2025-01-15T11:15:00'),
				updatedAt: new Date('2025-01-16T08:15:00'),
				createdBy: 'Demo User',
				quantity: 6,
				unit: 'pcs',
			},
			{
				id: '5',
				title: 'Coffee Beans',
				completed: false,
				createdAt: new Date('2025-01-16T09:00:00'),
				updatedAt: new Date('2025-01-16T09:00:00'),
				createdBy: 'Jane Smith',
				notes: 'Medium roast, Colombian',
				quantity: 500,
				unit: 'g',
			},
			{
				id: '6',
				title: 'Greek Yogurt',
				completed: false,
				createdAt: new Date('2025-01-16T10:00:00'),
				updatedAt: new Date('2025-01-16T10:00:00'),
				createdBy: 'Demo User',
				quantity: 4,
				unit: 'cups',
			},
		],
	},
	{
		id: '2',
		name: 'Party Supplies',
		createdAt: new Date('2025-01-10T14:00:00'),
		updatedAt: new Date('2025-01-18T16:00:00'),
		isArchived: false,
		ownerId: '1',
		owner: {
			id: '1',
			name: 'Charlie Brown',
			email: 'charlie@example.com',
			avatarUrl: undefined,
		},
		members: [
			{
				id: '1',
				name: 'Demo User',
				email: 'demo@example.com',
				role: 'owner',
			},
			{
				id: '3',
				name: 'Bob Wilson',
				email: 'bob@example.com',
				role: 'member',
			},
			{
				id: '4',
				name: 'Alice Johnson',
				email: 'alice@example.com',
				role: 'member',
			},
		],
		items: [
			{
				id: '7',
				title: 'Balloons',
				completed: true,
				createdAt: new Date('2025-01-10T14:30:00'),
				updatedAt: new Date('2025-01-13T10:00:00'),
				createdBy: 'Demo User',
				notes: 'Red and blue, 50 pack',
				quantity: 50,
				unit: 'pcs',
			},
			{
				id: '8',
				title: 'Party Hats',
				completed: true,
				createdAt: new Date('2025-01-10T14:45:00'),
				updatedAt: new Date('2025-01-13T10:30:00'),
				createdBy: 'Alice Johnson',
				quantity: 20,
				unit: 'pcs',
			},
			{
				id: '9',
				title: 'Plastic Plates',
				completed: false,
				createdAt: new Date('2025-01-11T09:00:00'),
				updatedAt: new Date('2025-01-11T09:00:00'),
				createdBy: 'Bob Wilson',
				notes: '100 count',
				quantity: 100,
				unit: 'pcs',
			},
			{
				id: '10',
				title: 'Napkins',
				completed: false,
				createdAt: new Date('2025-01-11T09:15:00'),
				updatedAt: new Date('2025-01-11T09:15:00'),
				createdBy: 'Demo User',
				quantity: 200,
				unit: 'pcs',
			},
		],
	},
	{
		id: '3',
		name: 'Home Improvement',
		createdAt: new Date('2024-12-20T08:00:00'),
		updatedAt: new Date('2025-01-19T17:00:00'),
		isArchived: false,
		ownerId: '1',
		owner: {
			id: '1',
			name: 'Charlie Brown',
			email: 'charlie@example.com',
			avatarUrl: undefined,
		},
		members: [
			{
				id: '1',
				name: 'Demo User',
				email: 'demo@example.com',
				role: 'owner',
			},
			{
				id: '2',
				name: 'Jane Smith',
				email: 'jane@example.com',
				role: 'member',
			},
		],
		items: [
			{
				id: '11',
				title: 'Paint - Living Room',
				completed: true,
				createdAt: new Date('2024-12-20T08:30:00'),
				updatedAt: new Date('2025-01-05T14:00:00'),
				createdBy: 'Demo User',
				notes: 'Eggshell white, 3 gallons',
				quantity: 3,
				unit: 'gal',
			},
			{
				id: '12',
				title: 'Light Fixtures',
				completed: false,
				createdAt: new Date('2024-12-21T10:00:00'),
				updatedAt: new Date('2024-12-21T10:00:00'),
				createdBy: 'Jane Smith',
				notes: 'LED, modern style',
				quantity: 2,
				unit: 'pcs',
			},
			{
				id: '13',
				title: 'Hardwood Flooring',
				completed: false,
				createdAt: new Date('2024-12-22T11:00:00'),
				updatedAt: new Date('2024-12-22T11:00:00'),
				createdBy: 'Demo User',
				notes: 'Oak, 500 sq ft',
				quantity: 500,
				unit: 'sqft',
			},
		],
	},
	{
		id: '4',
		name: 'Holiday Shopping 2024',
		createdAt: new Date('2024-11-01T10:00:00'),
		updatedAt: new Date('2024-12-30T15:00:00'),
		isArchived: true,
		ownerId: '1',
		owner: {
			id: '1',
			name: 'Charlie Brown',
			email: 'charlie@example.com',
			avatarUrl: undefined,
		},
		members: [
			{
				id: '1',
				name: 'Demo User',
				email: 'demo@example.com',
				role: 'owner',
			},
		],
		items: [
			{
				id: '14',
				title: 'Gift for Mom',
				completed: true,
				createdAt: new Date('2024-11-05T10:00:00'),
				updatedAt: new Date('2024-12-15T14:00:00'),
				createdBy: 'Demo User',
				quantity: 1,
				unit: 'pcs',
			},
			{
				id: '15',
				title: 'Gift for Dad',
				completed: true,
				createdAt: new Date('2024-11-05T10:15:00'),
				updatedAt: new Date('2024-12-18T16:00:00'),
				createdBy: 'Demo User',
				quantity: 1,
				unit: 'pcs',
			},
			{
				id: '16',
				title: 'Christmas Decorations',
				completed: true,
				createdAt: new Date('2024-11-10T09:00:00'),
				updatedAt: new Date('2024-12-01T11:00:00'),
				createdBy: 'Demo User',
				quantity: 1,
				unit: 'set',
			},
		],
	},
];

// ===========================================
// In-Memory Store (for mock operations)
// ===========================================

let listsStore = [...MOCK_LISTS];
let nextListId = 5;
let nextItemId = 17;

// Helper functions to generate IDs
export function generateListId(): string {
	return String(nextListId++);
}

export function generateItemId(): string {
	return String(nextItemId++);
}

// Get all lists
export function getMockLists(): ShoppingList[] {
	return [...listsStore];
}

// Set lists (for updates)
export function setMockLists(lists: ShoppingList[]): void {
	listsStore = [...lists];
}

// Get a single list by ID
export function getMockListById(id: string): ShoppingList | undefined {
	return listsStore.find((list) => list.id === id);
}

// Add a new list
export function addMockList(list: ShoppingList): void {
	listsStore = [list, ...listsStore];
}

// Update a list
export function updateMockList(id: string, updates: Partial<ShoppingList>): void {
	listsStore = listsStore.map((list) => (list.id === id ? { ...list, ...updates, updatedAt: new Date() } : list));
}

// Delete a list
export function deleteMockList(id: string): void {
	listsStore = listsStore.filter((list) => list.id !== id);
}

// Reset mock data to initial state
export function resetMockData(): void {
	listsStore = [...MOCK_LISTS];
	nextListId = 5;
	nextItemId = 17;
}

// Get user by ID
export function getMockUserById(id: string): User | undefined {
	return MOCK_USERS.find((user) => user.id === id);
}

// Get user by email
export function getMockUserByEmail(email: string): User | undefined {
	return MOCK_USERS.find((user) => user.email === email);
}
