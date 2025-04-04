import { GlossaryItem } from "@/data/scrumGlossary";
import { Card, CardContent, CardHeader } from "../ui/card";
import { phaseTextColorMap } from "@/lib/glossaryPhases";

export default function GlossaryCard({ item }: { item: GlossaryItem }) {
  const textColor = phaseTextColorMap[item.phase] || "text-muted-foreground";

  return (
    <Card className="mb-4">
      <CardHeader className="flex justify-between items-start">
        <div className="font-semibold text-primary flex flex-col gap-1">
          <div className="flex items-center gap-2">🔹 {item.term}</div>
          <span className={`text-xs font-semibold uppercase ${textColor}`}>
            {item.phase}
          </span>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {item.definition}
      </CardContent>
    </Card>
  );
}
