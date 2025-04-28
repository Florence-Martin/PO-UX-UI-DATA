"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
}

export default function BusinessRulesTableOfContents({
  headings,
}: {
  headings: Heading[];
}) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      let currentId = "";

      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentId = heading.id;
        }
      });

      setActiveId(currentId);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  return (
    <div className="sticky top-24 flex flex-col justify-between h-[calc(100vh-8rem)] overflow-y-auto p-2 text-sm">
      {/* Sommaire */}
      <nav className="flex-1 space-y-2">
        <h2 className="text-lg font-bold  mb-4">Sommaire</h2>
        <ul className="space-y-1">
          {headings.map((heading) => (
            <li key={heading.id}>
              <Link
                href={`#${heading.id}`}
                className={cn(
                  "flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors duration-300",
                  activeId === heading.id
                    ? "font-semibold text-primary"
                    : "text-muted-foreground"
                )}
              >
                {/* Dot actif */}
                {activeId === heading.id && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
                <span>{heading.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
