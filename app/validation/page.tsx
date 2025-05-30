import { promises as fs } from "fs";
import path from "path";
import { Suspense } from "react";
import { ValidationChecklists } from "@/components/validation/ValidationChecklists";
import { ApiTesting } from "@/components/validation/ApiTesting";
import { ExternalTools } from "@/components/validation/ExternalTools";
import { BannerInfo } from "@/components/banner/BannerInfo";
import SectionTabsLayout from "@/components/ui/SectionTabsLayout";
import { DatabaseDiagram } from "@/components/validation/DatabaseDiagram";
import BusinessRules from "@/components/validation/BusinessRules";

async function getBusinessRulesContent() {
  const filePath = path.join(
    process.cwd(),
    "documentation",
    "business-rules.md"
  );
  const fileContent = await fs.readFile(filePath, "utf-8");
  return fileContent;
}

export default async function ValidationPage() {
  const businessRulesContent = await getBusinessRulesContent();

  const tabs = [
    {
      value: "checklists",
      label: "Checklists de Validation",
      component: <ValidationChecklists />,
    },
    {
      value: "api",
      label: "Tests API",
      component: <ApiTesting />,
    },
    {
      value: "tools",
      label: "Outils & Diagramme",
      component: (
        <div className="grid gap-4 md:grid-cols-2">
          <ExternalTools />
          <DatabaseDiagram />
        </div>
      ),
    },
    {
      value: "business-rules",
      label: "Règles de gestion",
      component: <BusinessRules content={businessRulesContent} />,
    },
    // {
    //   value: "data-dictionary",
    //   label: "Dictionnaire de données",
    //   component: <DataDictionary content={dataDictionaryContent} />,
    // },
  ];

  return (
    <div className="flex-1 space-y-4 px-2 sm:px-6 md:px-8 pt-6">
      <BannerInfo />

      <Suspense fallback={<p>Chargement des onglets...</p>}>
        <SectionTabsLayout
          title="Validation Produit & Suivi Qualité"
          description="Centralise tes outils de validation, teste tes API et visualise la structure de tes données produit."
          tabs={tabs}
        />
      </Suspense>
    </div>
  );
}
