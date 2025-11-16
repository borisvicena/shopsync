import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

type ListHeaderProps = {
  name: string;
  isOwner: boolean;
  onUpdate: () => void;
};

export function ListHeader({ name, isOwner, onUpdate }: ListHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">{name}</h1>
        {isOwner && (
          <span
            className="inline-flex items-center rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white shadow-sm"
            role="status"
            aria-label="You are the owner of this list"
          >
            Owner
          </span>
        )}
      </div>

      {isOwner && (
        <Button variant="outline" size="sm" onClick={onUpdate} className="gap-2 transition-all hover:border-zinc-400">
          <Pencil className="h-4 w-4" />
          <span>Edit List Name</span>
        </Button>
      )}
    </div>
  );
}
