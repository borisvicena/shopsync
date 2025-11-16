"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { ListHeader } from "./list-header";
import { MembersSection } from "./members-section";
import { EmptyState } from "./empty-state";
import { AddItemDialog } from "./add-item-dialog";
import { AddMemberDialog } from "./add-member-dialog";
import { UpdateListDialog } from "./update-list-dialog";
import { ShoppingList } from "@/lib/types";
import { getListById, updateListName, addItem, toggleItemCompletion, deleteItem, removeMember } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ItemsList } from "./item-list";

type TabValue = "unresolved" | "all" | "resolved";

export function ListDetailContent({ listId }: { listId: string }) {
  const [listData, setListData] = useState<ShoppingList | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>("unresolved");
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isUpdateListOpen, setIsUpdateListOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadList();
  }, [listId]);

  const loadList = async () => {
    try {
      setIsLoading(true);
      const data = await getListById(listId);

      if (!data) {
        toast.error("This list doesn't exist or you don't have access");
        router.push("/");
        return;
      }

      setListData(data);
    } catch (error) {
      toast.error("Failed to load list. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !listData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  const filteredItems = listData.items.filter((item) => {
    if (activeTab === "unresolved") return !item.completed;
    if (activeTab === "resolved") return item.completed;
    return true;
  });

  const currentUserMember = listData.members[0];
  const isOwner = currentUserMember.role === "owner";

  const handleToggleItem = async (itemId: string) => {
    try {
      const updatedItem = await toggleItemCompletion(listId, itemId);
      if (updatedItem) {
        setListData((prev) =>
          prev
            ? {
                ...prev,
                items: prev.items.map((item) => (item.id === itemId ? updatedItem : item)),
              }
            : prev
        );
      }
    } catch (error) {
      toast.error("Failed to update item. Please try again.");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const success = await deleteItem(listId, itemId);
      if (success) {
        setListData((prev) =>
          prev
            ? {
                ...prev,
                items: prev.items.filter((item) => item.id !== itemId),
              }
            : prev
        );
        toast.success("Item deleted");
      }
    } catch (error) {
      toast.error("Failed to delete item. Please try again.");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const success = await removeMember(listId, memberId);
      if (success) {
        setListData((prev) =>
          prev
            ? {
                ...prev,
                members: prev.members.filter((m) => m.id !== memberId),
              }
            : prev
        );
        toast.success("Member removed");
      }
    } catch (error) {
      toast.error("Failed to remove member. Please try again.");
    }
  };

  const handleAddItem = async (title: string, notes?: string) => {
    try {
      const newItem = await addItem(listId, title, notes);
      if (newItem) {
        setListData((prev) =>
          prev
            ? {
                ...prev,
                items: [...prev.items, newItem],
              }
            : prev
        );
        toast.success(`"${title}" added to list`);
      }
    } catch (error) {
      toast.error("Failed to add item. Please try again.");
    }
  };

  const handleUpdateList = async (name: string) => {
    try {
      const updated = await updateListName(listId, name);
      if (updated) {
        setListData(updated);
        toast.success("List name updated");
      }
    } catch (error) {
      toast.error("Failed to update list. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-zinc-50 to-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            aria-label="Back to lists"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Lists</span>
          </Link>

          <ListHeader name={listData.name} isOwner={isOwner} onUpdate={() => setIsUpdateListOpen(true)} />

          <MembersSection
            members={listData.members}
            isOwner={isOwner}
            onRemoveMember={handleRemoveMember}
            onAddMember={() => setIsAddMemberOpen(true)}
          />

          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="unresolved" className="relative">
                    Unresolved
                    {listData.items.filter((i) => !i.completed).length > 0 && (
                      <span className="ml-2 rounded-full bg-zinc-900 px-2 py-0.5 text-xs text-white">
                        {listData.items.filter((i) => !i.completed).length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="resolved">
                    Resolved
                    {listData.items.filter((i) => i.completed).length > 0 && (
                      <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                        {listData.items.filter((i) => i.completed).length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Button onClick={() => setIsAddItemOpen(true)} className="shrink-0 gap-2 shadow-sm" size="sm">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Item</span>
              </Button>
            </div>

            {filteredItems.length === 0 ? (
              <EmptyState tab={activeTab} onAddItem={() => setIsAddItemOpen(true)} />
            ) : (
              <ItemsList items={filteredItems} onToggleItem={handleToggleItem} onDeleteItem={handleDeleteItem} />
            )}
          </div>
        </div>
      </div>

      <AddItemDialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen} onAdd={handleAddItem} />
      <AddMemberDialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen} />
      <UpdateListDialog
        open={isUpdateListOpen}
        onOpenChange={setIsUpdateListOpen}
        currentName={listData.name}
        onUpdate={handleUpdateList}
      />
    </main>
  );
}
