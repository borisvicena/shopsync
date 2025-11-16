"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Calendar,
  MoreVertical,
  Archive,
  Trash2,
  Users,
  ArchiveRestore,
  ExternalLink,
  Crown,
  User,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ShoppingListSummary } from "@/lib/types";

type ListCardProps = {
  list: ShoppingListSummary;
  onArchive?: (listId: string) => void;
  onUnarchive?: (listId: string) => void;
  onDelete: (listId: string) => void;
};

export function ListCard({ list, onArchive, onUnarchive, onDelete }: ListCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  const handleDelete = () => {
    onDelete(list.id);
    setShowDeleteDialog(false);
  };

  const handleArchive = () => {
    if (list.isArchived && onUnarchive) {
      onUnarchive(list.id);
    } else if (onArchive) {
      onArchive(list.id);
    }
    setShowArchiveDialog(false);
  };

  const completionPercentage =
    list.itemStats.total > 0 ? Math.round((list.itemStats.resolved / list.itemStats.total) * 100) : 0;

  return (
    <>
      <Card
        className={`group relative overflow-hidden transition-all hover:shadow-lg ${
          list.isArchived ? "border-zinc-300 bg-zinc-50/50" : "border-zinc-200 bg-white"
        }`}
      >
        <CardContent className="p-5">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <Link href={`/lists/${list.id}`} className="group/link inline-flex items-center gap-2">
                  <h3
                    className={`truncate text-lg font-semibold transition-colors group-hover/link:text-zinc-600 ${
                      list.isArchived ? "text-zinc-600" : "text-zinc-900"
                    }`}
                  >
                    {list.name}
                  </h3>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover/link:opacity-100" />
                </Link>

                <div className="mt-1.5 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      list.role === "owner" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {list.role === "owner" ? (
                      <Crown className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      <User className="h-3 w-3" aria-hidden="true" />
                    )}
                    {list.role === "owner" ? "Owner" : "Member"}
                  </span>

                  {list.isArchived && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      <Archive className="h-3 w-3" />
                      Archived
                    </span>
                  )}
                </div>
              </div>

              {/* Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="List actions"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href={`/lists/${list.id}`} className="cursor-pointer">
                      Open List
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {list.role === "owner" && (
                    <>
                      <DropdownMenuItem onClick={() => setShowArchiveDialog(true)} className="cursor-pointer">
                        {list.isArchived ? (
                          <>
                            <ArchiveRestore className="mr-2 h-4 w-4" />
                            Unarchive
                          </>
                        ) : (
                          <>
                            <Archive className="mr-2 h-4 w-4" />
                            Archive
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-zinc-600">
                  <span>Progress</span>
                  <span className="font-medium">{completionPercentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-green-500 to-green-600 transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                    role="progressbar"
                    aria-valuenow={completionPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${completionPercentage}% complete`}
                  />
                </div>
              </div>

              {/* Item Stats */}
              <div className="grid grid-cols-3 gap-2 rounded-lg bg-zinc-50 p-3">
                <div className="space-y-1 text-center">
                  <div className="text-xs text-zinc-600">Total</div>
                  <div className="text-lg font-semibold text-zinc-900">{list.itemStats.total}</div>
                </div>
                <div className="space-y-1 border-x border-zinc-200 text-center">
                  <div className="text-xs text-zinc-600">Pending</div>
                  <div className="text-lg font-semibold text-amber-600">{list.itemStats.unresolved}</div>
                </div>
                <div className="space-y-1 text-center">
                  <div className="text-xs text-zinc-600">Done</div>
                  <div className="text-lg font-semibold text-green-600">{list.itemStats.resolved}</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{formatDistanceToNow(list.updatedAt, { addSuffix: true })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {list.memberCount} member{list.memberCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Open Button */}
            <Link href={`/lists/${list.id}`} className="block">
              <Button
                variant="secondary"
                className="w-full font-medium transition-colors hover:bg-zinc-900 hover:text-white"
                size="sm"
              >
                Open List
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Shopping List</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>"{list.name}"</strong>? This will permanently remove the list and
              all its items. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete List
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Archive/Unarchive Confirmation */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{list.isArchived ? "Unarchive" : "Archive"} List</AlertDialogTitle>
            <AlertDialogDescription>
              {list.isArchived ? (
                <>
                  Are you sure you want to restore <strong>"{list.name}"</strong> from the archive? It will appear in
                  your active lists again.
                </>
              ) : (
                <>
                  Are you sure you want to archive <strong>"{list.name}"</strong>? You can restore it later from the
                  Archived tab.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive}>{list.isArchived ? "Unarchive" : "Archive"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
