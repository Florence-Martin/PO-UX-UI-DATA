"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ReactNode } from "react";

export type TabItem = {
  value: string;
  label: string;
  component: ReactNode;
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
  return (
    <div className="flex-1 space-y-4 px-4 sm:px-6 md:px-8 pt-6">
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

      <Tabs defaultValue={tabs[0].value || tabs[0].value} className="space-y-4">
        <TabsList className="flex flex-wrap gap-2 sm:gap-4 mb-9">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-4">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
