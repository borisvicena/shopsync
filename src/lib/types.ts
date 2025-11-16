// User types
export type UserRole = "owner" | "member";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

// List Member types
export type ListMember = User & {
  role: UserRole;
  joinedAt: Date;
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
};

// Shopping List types
export type ShoppingList = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  ownerId: string;
  members: ListMember[];
  items: ListItem[];
};

// List Summary (for home page cards)
export type ShoppingListSummary = {
  id: string;
  name: string;
  role: UserRole;
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
