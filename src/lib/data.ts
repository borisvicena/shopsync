import { User, ShoppingList } from "./types";

// Current user (simulating authentication)
export const currentUser: User = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  avatarUrl: undefined,
};

// Mock all users
export const users: User[] = [
  currentUser,
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
  },
  {
    id: "user-3",
    name: "Bob Johnson",
    email: "bob@example.com",
  },
  {
    id: "user-4",
    name: "Alice Williams",
    email: "alice@example.com",
  },
  {
    id: "user-5",
    name: "Charlie Brown",
    email: "charlie@example.com",
  },
];

// Mock shopping lists
export const shoppingLists: ShoppingList[] = [
  {
    id: "list-1",
    name: "Weekly Groceries",
    createdAt: new Date("2025-01-15T10:00:00"),
    updatedAt: new Date("2025-01-16T14:30:00"),
    isArchived: false,
    ownerId: "user-1",
    members: [
      {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        role: "owner",
        joinedAt: new Date("2025-01-15T10:00:00"),
      },
      {
        id: "user-2",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "member",
        joinedAt: new Date("2025-01-15T12:00:00"),
      },
      {
        id: "user-3",
        name: "Bob Johnson",
        email: "bob@example.com",
        role: "member",
        joinedAt: new Date("2025-01-16T09:00:00"),
      },
    ],
    items: [
      {
        id: "item-1",
        title: "Organic Milk",
        completed: false,
        createdAt: new Date("2025-01-15T10:30:00"),
        updatedAt: new Date("2025-01-15T10:30:00"),
        createdBy: "John Doe",
        notes: "2 gallons, whole milk",
      },
      {
        id: "item-2",
        title: "Fresh Bread",
        completed: false,
        createdAt: new Date("2025-01-15T11:00:00"),
        updatedAt: new Date("2025-01-15T11:00:00"),
        createdBy: "Jane Smith",
        notes: "Sourdough if available",
      },
      {
        id: "item-3",
        title: "Eggs",
        completed: true,
        createdAt: new Date("2025-01-15T10:45:00"),
        updatedAt: new Date("2025-01-16T08:00:00"),
        createdBy: "John Doe",
        notes: "12 pack, free range",
      },
      {
        id: "item-4",
        title: "Bananas",
        completed: true,
        createdAt: new Date("2025-01-15T11:15:00"),
        updatedAt: new Date("2025-01-16T08:15:00"),
        createdBy: "Bob Johnson",
      },
      {
        id: "item-5",
        title: "Coffee Beans",
        completed: false,
        createdAt: new Date("2025-01-16T09:00:00"),
        updatedAt: new Date("2025-01-16T09:00:00"),
        createdBy: "Jane Smith",
        notes: "Medium roast, Colombian",
      },
      {
        id: "item-6",
        title: "Greek Yogurt",
        completed: false,
        createdAt: new Date("2025-01-16T10:00:00"),
        updatedAt: new Date("2025-01-16T10:00:00"),
        createdBy: "John Doe",
      },
      {
        id: "item-7",
        title: "Chicken Breast",
        completed: false,
        createdAt: new Date("2025-01-16T11:00:00"),
        updatedAt: new Date("2025-01-16T11:00:00"),
        createdBy: "Bob Johnson",
        notes: "2 lbs, organic",
      },
    ],
  },
  {
    id: "list-2",
    name: "Party Supplies",
    createdAt: new Date("2025-01-10T14:00:00"),
    updatedAt: new Date("2025-01-14T16:00:00"),
    isArchived: false,
    ownerId: "user-2",
    members: [
      {
        id: "user-2",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "owner",
        joinedAt: new Date("2025-01-10T14:00:00"),
      },
      {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        role: "member",
        joinedAt: new Date("2025-01-10T15:00:00"),
      },
      {
        id: "user-4",
        name: "Alice Williams",
        email: "alice@example.com",
        role: "member",
        joinedAt: new Date("2025-01-11T10:00:00"),
      },
      {
        id: "user-5",
        name: "Charlie Brown",
        email: "charlie@example.com",
        role: "member",
        joinedAt: new Date("2025-01-11T11:00:00"),
      },
    ],
    items: [
      {
        id: "item-8",
        title: "Balloons",
        completed: true,
        createdAt: new Date("2025-01-10T14:30:00"),
        updatedAt: new Date("2025-01-13T10:00:00"),
        createdBy: "Jane Smith",
        notes: "Red and blue, 50 pack",
      },
      {
        id: "item-9",
        title: "Party Hats",
        completed: true,
        createdAt: new Date("2025-01-10T14:45:00"),
        updatedAt: new Date("2025-01-13T10:30:00"),
        createdBy: "Alice Williams",
      },
      {
        id: "item-10",
        title: "Plastic Plates",
        completed: false,
        createdAt: new Date("2025-01-11T09:00:00"),
        updatedAt: new Date("2025-01-11T09:00:00"),
        createdBy: "John Doe",
        notes: "100 count",
      },
      {
        id: "item-11",
        title: "Napkins",
        completed: false,
        createdAt: new Date("2025-01-11T09:15:00"),
        updatedAt: new Date("2025-01-11T09:15:00"),
        createdBy: "Charlie Brown",
      },
    ],
  },
  {
    id: "list-3",
    name: "Home Renovation",
    createdAt: new Date("2024-12-20T08:00:00"),
    updatedAt: new Date("2025-01-15T17:00:00"),
    isArchived: false,
    ownerId: "user-1",
    members: [
      {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        role: "owner",
        joinedAt: new Date("2024-12-20T08:00:00"),
      },
      {
        id: "user-2",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "member",
        joinedAt: new Date("2024-12-20T09:00:00"),
      },
    ],
    items: [
      {
        id: "item-12",
        title: "Paint - Living Room",
        completed: true,
        createdAt: new Date("2024-12-20T08:30:00"),
        updatedAt: new Date("2025-01-05T14:00:00"),
        createdBy: "John Doe",
        notes: "Eggshell white, 3 gallons",
      },
      {
        id: "item-13",
        title: "Light Fixtures",
        completed: false,
        createdAt: new Date("2024-12-21T10:00:00"),
        updatedAt: new Date("2024-12-21T10:00:00"),
        createdBy: "Jane Smith",
        notes: "LED, modern style",
      },
      {
        id: "item-14",
        title: "Hardwood Flooring",
        completed: false,
        createdAt: new Date("2024-12-22T11:00:00"),
        updatedAt: new Date("2024-12-22T11:00:00"),
        createdBy: "John Doe",
        notes: "Oak, 500 sq ft",
      },
    ],
  },
  {
    id: "list-4",
    name: "Holiday Shopping 2024",
    createdAt: new Date("2024-11-01T10:00:00"),
    updatedAt: new Date("2024-12-30T15:00:00"),
    isArchived: true,
    ownerId: "user-1",
    members: [
      {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        role: "owner",
        joinedAt: new Date("2024-11-01T10:00:00"),
      },
    ],
    items: [
      {
        id: "item-15",
        title: "Gift for Mom",
        completed: true,
        createdAt: new Date("2024-11-05T10:00:00"),
        updatedAt: new Date("2024-12-15T14:00:00"),
        createdBy: "John Doe",
      },
      {
        id: "item-16",
        title: "Gift for Dad",
        completed: true,
        createdAt: new Date("2024-11-05T10:15:00"),
        updatedAt: new Date("2024-12-18T16:00:00"),
        createdBy: "John Doe",
      },
      {
        id: "item-17",
        title: "Christmas Decorations",
        completed: true,
        createdAt: new Date("2024-11-10T09:00:00"),
        updatedAt: new Date("2024-12-01T11:00:00"),
        createdBy: "John Doe",
      },
    ],
  },
];

// Helper for simulating getting data from DB
export function getInitialData() {
  return {
    currentUser,
    users,
    lists: shoppingLists,
  };
}
