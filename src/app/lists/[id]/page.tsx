import { Suspense } from "react";
import { Metadata } from "next";
import { ListDetailContent } from "@/components/list-detail/list-detail-content";
import { ListDetailSkeleton } from "@/components/list-detail/list-detail-skeleton";

export async function generateStaticParams() {
  return [{ id: "list-1" }, { id: "list-2" }, { id: "list-3" }, { id: "list-4" }];
}

type Props = {
  params: Promise<{ id: string }> | { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;

  return {
    title: `Shopping List | ${id}`,
    description: "Manage your shopping list items and members",
  };
}

export default async function ListDetailPage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;

  return (
    <Suspense fallback={<ListDetailSkeleton />}>
      <ListDetailContent listId={id} />
    </Suspense>
  );
}
