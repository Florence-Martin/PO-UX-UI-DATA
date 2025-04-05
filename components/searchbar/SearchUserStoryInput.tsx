import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideX } from "lucide-react";

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

export const SearchUserStoryInput = ({ value, onChange, onReset }: Props) => {
  return (
    <div className="relative max-w-md">
      <Label htmlFor="search" className="sr-only">
        Rechercher par code ou mot-clé
      </Label>
      <Input
        id="search"
        placeholder="Ex: US-001, dashboard, persona..."
        value={value}
        onChange={onChange}
        className="text-sm pl-9 pr-10"
      />
      {value.length > 0 && (
        <button
          onClick={onReset}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Effacer la recherche"
        >
          <LucideX
            className="w-5 h-5 bg-red-500 rounded-sm text-white
          "
          />
        </button>
      )}
    </div>
  );
};
