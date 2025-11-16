import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingCart, Plus, Package } from "lucide-react";

type EmptyStateProps = {
  tab: "unresolved" | "all" | "resolved";
  onAddItem: () => void;
};

export function EmptyState({ tab, onAddItem }: EmptyStateProps) {
  const getContent = () => {
    switch (tab) {
      case "unresolved":
        return {
          icon: ShoppingCart,
          title: "No unresolved items",
          description: "Add items to your shopping list to get started.",
          showButton: true,
        };
      case "resolved":
        return {
          icon: CheckCircle2,
          title: "No completed items yet",
          description: "Items you mark as complete will appear here for reference.",
          showButton: false,
        };
      case "all":
        return {
          icon: Package,
          title: "Your list is empty",
          description: "Start by adding items to your shopping list.",
          showButton: true,
        };
    }
  };

  const content = getContent();
  const Icon = content.icon;

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50/50 px-4 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
        <Icon className="h-8 w-8 text-zinc-400" aria-hidden="true" />
      </div>
      <h3 className="mt-6 text-lg font-semibold text-zinc-900">{content.title}</h3>
      <p className="mt-2 max-w-sm text-sm text-zinc-600">{content.description}</p>
      {content.showButton && (
        <Button onClick={onAddItem} className="mt-6 gap-2">
          <Plus className="h-4 w-4" />
          Add Your First Item
        </Button>
      )}
    </div>
  );
}
