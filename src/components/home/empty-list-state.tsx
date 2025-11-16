import { Button } from "@/components/ui/button";
import { ShoppingCart, Archive, Search, Plus } from "lucide-react";

type EmptyListsStateProps = {
  type: "active" | "archived";
  hasSearch: boolean;
  onCreateList?: () => void;
  onClearSearch?: () => void;
};

export function EmptyListsState({ type, hasSearch, onCreateList, onClearSearch }: EmptyListsStateProps) {
  if (hasSearch) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50/50 px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
          <Search className="h-8 w-8 text-zinc-400" aria-hidden="true" />
        </div>
        <h3 className="mt-6 text-lg font-semibold text-zinc-900">No lists found</h3>
        <p className="mt-2 max-w-sm text-sm text-zinc-600">
          We couldn't find any lists matching your search. Try different keywords or clear your search.
        </p>
        {onClearSearch && (
          <Button onClick={onClearSearch} variant="outline" className="mt-6">
            Clear Search
          </Button>
        )}
      </div>
    );
  }

  if (type === "archived") {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50/50 px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
          <Archive className="h-8 w-8 text-zinc-400" aria-hidden="true" />
        </div>
        <h3 className="mt-6 text-lg font-semibold text-zinc-900">No archived lists</h3>
        <p className="mt-2 max-w-sm text-sm text-zinc-600">
          Lists you archive will appear here. Archive lists you no longer need but want to keep for reference.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50/50 px-4 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
        <ShoppingCart className="h-8 w-8 text-zinc-400" aria-hidden="true" />
      </div>
      <h3 className="mt-6 text-lg font-semibold text-zinc-900">No shopping lists yet</h3>
      <p className="mt-2 max-w-sm text-sm text-zinc-600">
        Get started by creating your first shopping list. You can add items and invite members to collaborate.
      </p>
      {onCreateList && (
        <Button onClick={onCreateList} className="mt-6 gap-2">
          <Plus className="h-4 w-4" />
          Create Your First List
        </Button>
      )}
    </div>
  );
}
