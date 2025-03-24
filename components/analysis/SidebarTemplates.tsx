import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Persona } from "@/lib/personaService";

type SidebarTemplatesProps = {
  templates: {
    id: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  activeTemplate: string | null;
  onTemplateClick: (id: string) => void;
  onCreatePersona: () => void;
  personas: Persona[];
  onSelectPersona: (id: string) => void;
  onDeletePersona: (id: string, name: string) => void;
};

export function SidebarTemplates({
  templates,
  activeTemplate,
  onTemplateClick,
  onCreatePersona,
  personas,
  onSelectPersona,
  onDeletePersona,
}: SidebarTemplatesProps) {
  return (
    <div className="space-y-2">
      {templates.map(({ id, title, icon: Icon }) => (
        <Button
          key={id}
          variant={activeTemplate === id ? "default" : "outline"}
          className="w-full justify-start"
          onClick={() => onTemplateClick(id)}
        >
          <Icon className="mr-2 h-4 w-4" />
          {title}
        </Button>
      ))}

      <div className="pt-4 border-t border-muted">
        <Button
          variant="secondary"
          className="w-full mb-4"
          onClick={onCreatePersona}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Persona
        </Button>
        <p className="text-sm font-semibold text-muted-foreground mb-1">
          Personas sauvegardés
        </p>
        {personas.map((persona) => (
          <div
            key={persona.id}
            className="flex items-center justify-between space-y-2"
          >
            <Button
              variant={activeTemplate === persona.id ? "default" : "outline"}
              className="w-full justify-start text-left mr-2"
              onClick={() => onSelectPersona(persona.id)}
            >
              👤 {persona.name}
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDeletePersona(persona.id, persona.name)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
