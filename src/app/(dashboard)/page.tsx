import { Suspense } from "react";
import { Metadata } from "next";
import { HomeContent } from "@/components/home/home-content";
import { HomePageSkeleton } from "@/components/home/home-page-skeleton";
import AuthGuard from "@/components/auth/auth-guard";

export const metadata: Metadata = {
  title: "Shopsync | Your Shopping Lists",
  description: "Manage and collaborate on shopping lists with your team",
};

export default function HomePage() {
  return (
    <AuthGuard fallback={<HomePageSkeleton />}>
      <Suspense fallback={<HomePageSkeleton />}>
        <HomeContent />
      </Suspense>
    </AuthGuard>
  );
}
