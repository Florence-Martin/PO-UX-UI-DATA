// app/not-found.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
      <Image
        src="/connected.svg"
        alt="Page non trouvée"
        width={400}
        height={300}
        className="mx-auto"
      />
      <h1 className="text-3xl font-bold">Page non câblée</h1>
      <p className="text-muted-foreground max-w-md">
        Cette section illustre une future intégration. L’application est encore
        en cours de conception et n’est pas encore connectée à un projet réel ou
        à des outils externes (Jira, Confluence, Figma…).
      </p>
      <Link href="/">
        <Button variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au Dashboard
        </Button>
      </Link>
    </div>
  );
}
