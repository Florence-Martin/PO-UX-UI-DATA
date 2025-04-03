"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { UserStoriesList } from "@/components/backlog/UserStoryList";

export default function UserStoriesPage() {
  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <Link
        href="/analysis"
        className="inline-flex items-center text-sm text-primary hover:underline w-fit"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour à l’analyse produit
      </Link>

      <UserStoriesList />
    </div>
  );
}
