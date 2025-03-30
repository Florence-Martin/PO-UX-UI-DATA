"use client";

import { useSearchParams } from "next/navigation";
import type { TabItem } from "@/components/ui/SectionTabsLayout";
import SectionTabsLayout from "@/components/ui/SectionTabsLayout";

type ClientTabsWrapperProps = {
  title: string;
  description?: string;
  tabs: TabItem[];
};

export default function ClientTabsWrapper({
  title,
  description,
  tabs,
}: ClientTabsWrapperProps) {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") ?? tabs[0].value;

  return (
    <SectionTabsLayout
      title={title}
      description={description}
      tabs={tabs}
      defaultTab={defaultTab} // 🔥 important ici
    />
  );
}
