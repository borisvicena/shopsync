import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Plus, X, Crown } from "lucide-react";
import { ListMember } from "@/lib/types";

type MembersSectionProps = {
  members: ListMember[];
  isOwner: boolean;
  onRemoveMember: (memberId: string) => void;
  onAddMember: () => void;
};

export function MembersSection({ members, isOwner, onRemoveMember, onAddMember }: MembersSectionProps) {
  const [memberToRemove, setMemberToRemove] = useState<ListMember | null>(null);

  const handleConfirmRemove = () => {
    if (memberToRemove) {
      onRemoveMember(memberToRemove.id);
      setMemberToRemove(null);
    }
  };

  return (
    <>
      <Card className="border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">
            Members
            <span className="ml-2 text-sm font-normal text-zinc-500">({members.length})</span>
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="group relative inline-flex items-center gap-2 rounded-full bg-zinc-100 py-2 pl-4 pr-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200"
            >
              <div className="flex items-center gap-2">
                {member.role === "owner" && <Crown className="h-3.5 w-3.5 text-amber-600" aria-label="Owner" />}
                <span>{member.name}</span>
              </div>

              {isOwner && member.role !== "owner" && (
                <button
                  onClick={() => setMemberToRemove(member)}
                  className="rounded-full p-0.5 text-zinc-400 transition-colors hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label={`Remove ${member.name} from list`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}

          {isOwner && (
            <Button variant="secondary" size="sm" onClick={onAddMember} className="gap-2 rounded-full">
              <Plus className="h-4 w-4" />
              <span>Add Member</span>
            </Button>
          )}
        </div>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!memberToRemove} onOpenChange={(open) => !open && setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{memberToRemove?.name}</strong> from this list? They will lose
              access to all items and won't be able to make changes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRemove} className="bg-red-600 hover:bg-red-700">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
