"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2 } from "lucide-react";
import { ListCard } from "./list-card";
import { CreateListDialog } from "./create-list-dialog";
import { ShoppingListSummary } from "@/lib/types";
import { getLists, createList, archiveList, unarchiveList, deleteList } from "@/lib/api";
import { toast } from "sonner";
import { EmptyListsState } from "./empty-list-state";

type TabValue = "all" | "archived";

export function HomeContent() {
  const [lists, setLists] = useState<ShoppingListSummary[]>([]);
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      setIsLoading(true);
      const data = await getLists();
      setLists(data);
    } catch (error) {
      toast.error("Failed to load lists. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLists = useMemo(() => {
    return lists.filter((list) => {
      const matchesTab = activeTab === "all" ? !list.isArchived : list.isArchived;
      const matchesSearch = list.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [lists, activeTab, searchQuery]);

  const activeLists = lists.filter((l) => !l.isArchived).length;
  const archivedLists = lists.filter((l) => l.isArchived).length;

  const handleCreateList = async (name: string) => {
    try {
      const newList = await createList(name);

      const summary: ShoppingListSummary = {
        id: newList.id,
        name: newList.name,
        role: "owner",
        itemStats: { total: 0, unresolved: 0, resolved: 0 },
        createdAt: newList.createdAt,
        updatedAt: newList.updatedAt,
        isArchived: false,
        memberCount: 1,
      };

      setLists((prev) => [summary, ...prev]);
      toast.success(`"${name}" has been created`);
    } catch (error) {
      toast.error("Failed to create list. Please try again.");
    }
  };

  const handleArchiveList = async (listId: string) => {
    try {
      await archiveList(listId);
      setLists((prev) => prev.map((list) => (list.id === listId ? { ...list, isArchived: true } : list)));
      toast.success("List archived successfully");
    } catch (error) {
      toast.error("Failed to archive list. Please try again.");
    }
  };

  const handleUnarchiveList = async (listId: string) => {
    try {
      await unarchiveList(listId);
      setLists((prev) => prev.map((list) => (list.id === listId ? { ...list, isArchived: false } : list)));
      toast.success("List restored from archive");
    } catch (error) {
      toast.error("Failed to restore list. Please try again.");
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      await deleteList(listId);
      setLists((prev) => prev.filter((list) => list.id !== listId));
      toast.success("List deleted successfully");
    } catch (error) {
      toast.error("Failed to delete list. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-zinc-50 to-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Your Shopping Lists</h1>
            <p className="text-zinc-600">Manage and collaborate on shopping lists with your team</p>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                type="search"
                placeholder="Search lists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                aria-label="Search shopping lists"
              />
            </div>

            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2 shadow-sm" size="default">
              <Plus className="h-4 w-4" />
              <span>Create New List</span>
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="all" className="gap-2">
                Active
                {activeLists > 0 && (
                  <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-xs text-white">{activeLists}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="archived" className="gap-2">
                Archived
                {archivedLists > 0 && (
                  <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-700">{archivedLists}</span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {filteredLists.length === 0 ? (
                <EmptyListsState
                  type="active"
                  hasSearch={searchQuery.length > 0}
                  onCreateList={() => setIsCreateDialogOpen(true)}
                  onClearSearch={() => setSearchQuery("")}
                />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredLists.map((list) => (
                    <ListCard key={list.id} list={list} onArchive={handleArchiveList} onDelete={handleDeleteList} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="archived" className="mt-6">
              {filteredLists.length === 0 ? (
                <EmptyListsState
                  type="archived"
                  hasSearch={searchQuery.length > 0}
                  onClearSearch={() => setSearchQuery("")}
                />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredLists.map((list) => (
                    <ListCard key={list.id} list={list} onUnarchive={handleUnarchiveList} onDelete={handleDeleteList} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreateListDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onCreate={handleCreateList} />
    </main>
  );
}
