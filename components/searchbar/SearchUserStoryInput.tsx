import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchUserStoryInput = ({ value, onChange }: Props) => {
  return (
    <>
      <Label htmlFor="search">Rechercher par code ou mot-clé</Label>
      <Input
        id="search"
        placeholder="Ex: US-001, dashboard, persona..."
        value={value}
        onChange={onChange}
        className="text-sm"
      />
    </>
  );
};
