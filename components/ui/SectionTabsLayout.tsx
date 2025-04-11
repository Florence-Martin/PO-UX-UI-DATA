"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export type TabItem = {
  value: string;
  label: string;
  component: ReactNode | (() => ReactNode);
};

type SectionTabsLayoutProps = {
  title: string;
  description?: string;
  tabs: TabItem[];
  defaultTab?: string;
};

export default function SectionTabsLayout({
  title,
  description,
  tabs,
}: SectionTabsLayoutProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabs[0].value);

  useEffect(() => {
    if (!tabParam) return;

    const matchedTab = tabs.find((tab) => tab.value === tabParam);

    if (matchedTab) {
      setActiveTab(tabParam);

      const hash = window.location.hash;

      if (hash) {
        // Convertit le hash en sélecteur CSS valide
        const escapedHash = CSS.escape(hash.replace("#", ""));
        const el = document.querySelector(`#${escapedHash}`);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
        }
      }
    }
  }, [tabParam, tabs]);

  return (
    <div className="flex-1 space-y-4 px-2 sm:px-6 md:px-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
      </div>

      {description && (
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl">
          {description}
        </p>
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="flex flex-wrap gap-2 sm:gap-4 mb-9">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-4">
            {typeof tab.component === "function"
              ? tab.component()
              : tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
