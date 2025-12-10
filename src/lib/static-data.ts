// ===========================================
// Static Data - Backward Compatibility Layer
// ===========================================
// This file maintains backward compatibility with existing code
// that imports from static-data.ts
//
// All actual mock data is now in mock-data.ts

export {
  MOCK_USERS,
  MOCK_CURRENT_USER as MOCK_USER,
  MOCK_LISTS,
  getMockLists as getAllLists,
  setMockLists as setLists,
  getMockListById as getListFromStore,
  addMockList as addListToStore,
  updateMockList as updateListInStore,
  deleteMockList as deleteListFromStore,
  generateListId,
  generateItemId,
} from "./mock-data";

// Re-export types for convenience
export type { ShoppingList, ShoppingListSummary, ListItem, ListMember, User } from "./types";
