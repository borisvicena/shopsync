import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, Pencil, Trash2, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ListItem } from "@/lib/types";

type ItemsListProps = {
  items: ListItem[];
  onToggleItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
};

export function ItemsList({ items, onToggleItem, onDeleteItem }: ItemsListProps) {
  const [itemToDelete, setItemToDelete] = useState<ListItem | null>(null);

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onDeleteItem(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  return (
    <>
      <div className="space-y-3" role="list" aria-label="Shopping list items">
        {items.map((item) => (
          <Card
            key={item.id}
            className={`group relative overflow-hidden border bg-white p-4 shadow-sm transition-all hover:shadow-md ${
              item.completed ? "border-green-200 bg-green-50/30" : "border-zinc-200"
            }`}
            role="listitem"
          >
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <div className="pt-0.5">
                <Checkbox
                  id={`item-${item.id}`}
                  checked={item.completed}
                  onCheckedChange={() => onToggleItem(item.id)}
                  aria-label={`Mark ${item.title} as ${item.completed ? "incomplete" : "complete"}`}
                  className="h-5 w-5"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-2">
                <label
                  htmlFor={`item-${item.id}`}
                  className={`block cursor-pointer text-base font-medium transition-colors ${
                    item.completed ? "text-zinc-500 line-through" : "text-zinc-900"
                  }`}
                >
                  {item.title}
                </label>

                {item.notes && (
                  <div className="flex items-start gap-2 text-sm text-zinc-600">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                    <p className="line-clamp-2">{item.notes}</p>
                  </div>
                )}

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>
                          {formatDistanceToNow(item.createdAt, {
                            addSuffix: true,
                          })}{" "}
                          by {item.createdBy}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {item.createdAt.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
                <Button size="icon" variant="ghost" className="h-8 w-8" aria-label={`Edit ${item.title}`}>
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => setItemToDelete(item)}
                  aria-label={`Delete ${item.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Completed indicator */}
            {item.completed && <div className="absolute left-0 top-0 h-full w-1 bg-green-500" />}
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>"{itemToDelete?.title}"</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
