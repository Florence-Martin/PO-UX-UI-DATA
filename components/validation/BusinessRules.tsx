"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import BusinessRulesTableOfContents from "./BusinessRulesTableOfContents";

interface Heading {
  id: string;
  text: string;
}

interface BusinessRulesProps {
  content: string;
}

export default function BusinessRules({ content }: BusinessRulesProps) {
  const { parsedContent, headings } = useMemo(() => {
    if (!content) return { parsedContent: null, headings: [] };

    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    const headings: Heading[] = [];

    let currentBlock: JSX.Element[] = [];

    const slugify = (text: string) =>
      text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

    const pushCurrentBlock = () => {
      if (currentBlock.length > 0) {
        elements.push(
          <Card key={Math.random()} className="mb-4 border-l-4 border-blue-200">
            <CardContent className="p-4">{currentBlock}</CardContent>
          </Card>
        );
        currentBlock = [];
      }
    };

    const formatText = (text: string) => {
      const cleanedText = text.replace(/\*\*/g, ""); // SUPPRIME tous les **
      return cleanedText.split(/(RG\d+\.\d+)/g).map((part, index) =>
        part.startsWith("RG") ? (
          <span key={index} className="font-bold text-blue-400">
            {part}
          </span>
        ) : (
          part
        )
      );
    };

    for (const line of lines) {
      if (line.startsWith("# ")) {
        pushCurrentBlock();
        const cleanTitle = line.replace("# ", "").trim();
        const id = slugify(cleanTitle);

        headings.push({ id, text: cleanTitle });

        elements.push(
          <h1 key={id} id={id} className="text-3xl font-bold my-6 scroll-mt-24">
            {cleanTitle}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        pushCurrentBlock();
        const cleanTitle = line.replace("## ", "").trim();
        const id = slugify(cleanTitle);

        headings.push({ id, text: cleanTitle });

        elements.push(
          <h2 key={id} id={id} className="text-2xl font-bold my-5 scroll-mt-24">
            {cleanTitle}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        pushCurrentBlock();
        const cleanTitle = line.replace("### ", "").trim();
        const id = slugify(cleanTitle);

        headings.push({ id, text: cleanTitle });

        elements.push(
          <h3
            key={id}
            id={id}
            className="text-xl font-semibold my-4 scroll-mt-24"
          >
            {cleanTitle}
          </h3>
        );
      } else if (line.trim().startsWith("- ")) {
        currentBlock.push(
          <p key={Math.random()} className="text-sm text-muted-foreground mb-2">
            {formatText(line.slice(2))}
          </p>
        );
      }
    }

    pushCurrentBlock();
    return { parsedContent: elements, headings };
  }, [content]);

  if (!content) {
    return (
      <p className="text-muted-foreground text-sm">
        Chargement des règles métier...
      </p>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Table of Contents */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <BusinessRulesTableOfContents headings={headings} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 prose prose-invert max-w-none px-4 pt-8 lg:pt-0">
        {parsedContent}
      </main>
    </div>
  );
}
