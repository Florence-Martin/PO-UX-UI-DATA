import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Persona } from "@/lib/services/personaService";
import { Scenario } from "@/lib/services/scenarioService";

// Types des props
interface SidebarTemplatesProps {
  templates: {
    id: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  activeTemplate: string | null;
  onTemplateClick: (id: string) => void;

  // Personas
  personas: Persona[];
  onCreatePersona: () => void;
  onSelectPersona: (id: string) => void;
  onDeletePersona: (id: string, name: string) => void;

  // Scénarios de test
  scenarios: Scenario[];
  onCreateScenario: () => void;
  onSelectScenario: (id: string) => void;
  onDeleteScenario: (id: string, title: string) => void;
}

export function SidebarTemplates({
  templates,
  activeTemplate,
  onTemplateClick,
  personas,
  onCreatePersona,
  onSelectPersona,
  onDeletePersona,
  scenarios,
  onCreateScenario,
  onSelectScenario,
  onDeleteScenario,
}: SidebarTemplatesProps) {
  return (
    <div className="space-y-4">
      {/* Navigation entre templates */}
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

      {/* Bloc Personas */}
      {activeTemplate === "persona" && (
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
            <div key={persona.id} className="flex items-center justify-between">
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
      )}

      {/* Bloc Scénarios */}
      {activeTemplate === "scenario" && (
        <div className="pt-4 border-t border-muted">
          <Button
            variant="secondary"
            className="w-full mb-4"
            onClick={onCreateScenario}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Scénario
          </Button>
          <p className="text-sm font-semibold text-muted-foreground mb-1">
            Scénarios sauvegardés
          </p>
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="flex items-center justify-between"
            >
              <Button
                variant={activeTemplate === scenario.id ? "default" : "outline"}
                className="w-full justify-start text-left mr-2 truncate overflow-hidden text-ellipsis"
                onClick={() => onSelectScenario(scenario.id)}
              >
                🗣️ {scenario.title}
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDeleteScenario(scenario.id, scenario.title)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
