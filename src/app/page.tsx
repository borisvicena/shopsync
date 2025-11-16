import { Suspense } from "react";
import { Metadata } from "next";
import { HomeContent } from "@/components/home/home-content";
import { HomePageSkeleton } from "@/components/home/home-page-skeleton";

export const metadata: Metadata = {
  title: "Shopsync | Your Shopping Lists",
  description: "Manage and collaborate on shopping lists with your team",
};

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
