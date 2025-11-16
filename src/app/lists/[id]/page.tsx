import { Suspense } from "react";
import { Metadata } from "next";
import { ListDetailContent } from "@/components/list-detail/list-detail-content";
import { ListDetailSkeleton } from "@/components/list-detail/list-detail-skeleton";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Shopping List | List ${id}`,
    description: "Manage your shopping list items and members",
  };
}

export default async function ListDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <Suspense fallback={<ListDetailSkeleton />}>
      <ListDetailContent listId={id} />
    </Suspense>
  );
}
