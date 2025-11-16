import { ShoppingList, ShoppingListSummary, ListItem, ListMember } from "./types";
import { shoppingLists, currentUser } from "./data";

// Simulate async operations (like real API calls)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// LISTS API
// --------------------------------------------

/**
 * Get all lists for current user
 */
export async function getLists(): Promise<ShoppingListSummary[]> {
  await delay(300); // Simulate network delay

  return shoppingLists.map((list) => {
    const userMember = list.members.find((m) => m.id === currentUser.id);
    const role = userMember?.role || "member";

    return {
      id: list.id,
      name: list.name,
      role,
      itemStats: {
        total: list.items.length,
        unresolved: list.items.filter((item) => !item.completed).length,
        resolved: list.items.filter((item) => item.completed).length,
      },
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
      isArchived: list.isArchived,
      memberCount: list.members.length,
    };
  });
}

/**
 * Get a single list by ID
 */
export async function getListById(listId: string): Promise<ShoppingList | null> {
  await delay(200);

  const list = shoppingLists.find((l) => l.id === listId);
  return list || null;
}

/**
 * Create a new list
 */
export async function createList(name: string): Promise<ShoppingList> {
  await delay(300);

  const newList: ShoppingList = {
    id: `list-${Date.now()}`,
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
    isArchived: false,
    ownerId: currentUser.id,
    members: [
      {
        ...currentUser,
        role: "owner",
        joinedAt: new Date(),
      },
    ],
    items: [],
  };

  shoppingLists.unshift(newList);
  return newList;
}

/**
 * Update list name
 */
export async function updateListName(listId: string, name: string): Promise<ShoppingList | null> {
  await delay(200);

  const listIndex = shoppingLists.findIndex((l) => l.id === listId);
  if (listIndex === -1) return null;

  shoppingLists[listIndex] = {
    ...shoppingLists[listIndex],
    name,
    updatedAt: new Date(),
  };

  return shoppingLists[listIndex];
}

/**
 * Archive a list
 */
export async function archiveList(listId: string): Promise<boolean> {
  await delay(200);

  const listIndex = shoppingLists.findIndex((l) => l.id === listId);
  if (listIndex === -1) return false;

  shoppingLists[listIndex] = {
    ...shoppingLists[listIndex],
    isArchived: true,
    updatedAt: new Date(),
  };

  return true;
}

/**
 * Unarchive a list
 */
export async function unarchiveList(listId: string): Promise<boolean> {
  await delay(200);

  const listIndex = shoppingLists.findIndex((l) => l.id === listId);
  if (listIndex === -1) return false;

  shoppingLists[listIndex] = {
    ...shoppingLists[listIndex],
    isArchived: false,
    updatedAt: new Date(),
  };

  return true;
}

/**
 * Delete a list
 */
export async function deleteList(listId: string): Promise<boolean> {
  await delay(200);

  const listIndex = shoppingLists.findIndex((l) => l.id === listId);
  if (listIndex === -1) return false;

  shoppingLists.splice(listIndex, 1);
  return true;
}

// ITEMS API
// --------------------------------------------

/**
 * Add item to list
 */
export async function addItem(listId: string, title: string, notes?: string): Promise<ListItem | null> {
  await delay(200);

  const list = shoppingLists.find((l) => l.id === listId);
  if (!list) return null;

  const newItem: ListItem = {
    id: `item-${Date.now()}`,
    title,
    notes,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: currentUser.name,
  };

  list.items.push(newItem);
  list.updatedAt = new Date();

  return newItem;
}

/**
 * Update item
 */
export async function updateItem(
  listId: string,
  itemId: string,
  updates: Partial<Pick<ListItem, "title" | "notes" | "completed">>
): Promise<ListItem | null> {
  await delay(200);

  const list = shoppingLists.find((l) => l.id === listId);
  if (!list) return null;

  const itemIndex = list.items.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) return null;

  list.items[itemIndex] = {
    ...list.items[itemIndex],
    ...updates,
    updatedAt: new Date(),
  };
  list.updatedAt = new Date();

  return list.items[itemIndex];
}

/**
 * Toggle item completion
 */
export async function toggleItemCompletion(listId: string, itemId: string): Promise<ListItem | null> {
  await delay(150);

  const list = shoppingLists.find((l) => l.id === listId);
  if (!list) return null;

  const itemIndex = list.items.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) return null;

  list.items[itemIndex] = {
    ...list.items[itemIndex],
    completed: !list.items[itemIndex].completed,
    updatedAt: new Date(),
  };
  list.updatedAt = new Date();

  return list.items[itemIndex];
}

/**
 * Delete item
 */
export async function deleteItem(listId: string, itemId: string): Promise<boolean> {
  await delay(200);

  const list = shoppingLists.find((l) => l.id === listId);
  if (!list) return false;

  const itemIndex = list.items.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) return false;

  list.items.splice(itemIndex, 1);
  list.updatedAt = new Date();

  return true;
}

// MEMBERS API
// --------------------------------------------

/**
 * Add member to list
 */
export async function addMember(listId: string, userId: string): Promise<ListMember | null> {
  await delay(300);

  const list = shoppingLists.find((l) => l.id === listId);
  if (!list) return null;

  if (list.members.some((m) => m.id === userId)) {
    return null;
  }

  const user = {
    id: userId,
    name: "New Member",
    email: "newmember@example.com",
  };

  const newMember: ListMember = {
    ...user,
    role: "member",
    joinedAt: new Date(),
  };

  list.members.push(newMember);
  list.updatedAt = new Date();

  return newMember;
}

/**
 * Remove member from list
 */
export async function removeMember(listId: string, memberId: string): Promise<boolean> {
  await delay(200);

  const list = shoppingLists.find((l) => l.id === listId);
  if (!list) return false;

  const memberIndex = list.members.findIndex((m) => m.id === memberId);
  if (memberIndex === -1) return false;

  if (list.members[memberIndex].role === "owner") return false;

  list.members.splice(memberIndex, 1);
  list.updatedAt = new Date();

  return true;
}

/**
 * Get current user
 */
export function getCurrentUser() {
  return currentUser;
}
