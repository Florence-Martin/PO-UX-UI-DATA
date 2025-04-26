"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function BusinessRules({ content }: { content: string }) {
  const parseMarkdown = (markdown: string) => {
    const lines = markdown.split("\n");
    const elements = [];

    for (const line of lines) {
      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={line} className="text-2xl font-bold mt-8 mb-4">
            {line.replace("## ", "")}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={line} className="text-xl font-semibold mt-6 mb-3 ">
            {line.replace("### ", "")}
          </h3>
        );
      } else if (line.trim().startsWith("- ")) {
        // Supprimer les `**` et afficher chaque point dans une Card
        const cleanedText = line
          .replace("- ", "") // Supprime le tiret
          .replace(/\*\*/g, ""); // Supprime les `**`

        // Remplacer "RG" par une version stylisée
        const styledText = cleanedText
          .split(/(RG\d+\.\d+)/)
          .map((part, index) =>
            part.startsWith("RG") ? (
              <span key={index} className="font-bold text-blue-600">
                {part}
              </span>
            ) : (
              part
            )
          );

        elements.push(
          <Card key={line} className="mb-4 border-l-4 border-blue-600">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{styledText}</p>
            </CardContent>
          </Card>
        );
      } else if (line.trim() === "\u23BB") {
        elements.push(
          <hr
            key={Math.random()}
            className="my-8 border-t border-muted-foreground/20"
          />
        );
      }
    }

    return elements;
  };

  return (
    <div className="prose prose-invert max-w-4xl mx-auto px-4">
      {content ? (
        parseMarkdown(content)
      ) : (
        <p>Chargement des règles métier...</p>
      )}
    </div>
  );
}
