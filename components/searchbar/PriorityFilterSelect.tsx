"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw } from "lucide-react";
import { Button } from "../ui/button";

interface PriorityFilterSelectProps {
  onFilterChange: (priority: string) => void;
  onSearchChange?: (search: string) => void;
  searchValue?: string;
  hideAllOption?: boolean;
}

export const PriorityFilterSelect = ({
  onFilterChange,
  onSearchChange,
  searchValue = "", // 🔧 correction ici
  hideAllOption = false,
}: PriorityFilterSelectProps) => {
  const router = useRouter();
  const [priority, setPriority] = useState("high");

  // 🔁 Debounce pour limiter les appels de recherche
  const [localSearch, setLocalSearch] = useState(searchValue);

  useEffect(() => {
    const delay = setTimeout(() => {
      onSearchChange?.(localSearch);
    }, 300);

    return () => clearTimeout(delay);
  }, [localSearch]);

  useEffect(() => {
    setLocalSearch(searchValue); // 🔄 garde le champ synchro si modif externe
  }, [searchValue]);

  const handlePriorityChange = (value: string) => {
    setPriority(value);
    if (value === "all") {
      router.push("/user-stories");
    } else {
      onFilterChange(value);
    }
  };

  const handleReset = () => {
    setPriority("high");
    setLocalSearch("");
    onFilterChange("high");
    onSearchChange?.("");
  };

  return (
    <>
      {/* Filtre + reset */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2 w-full sm:w-auto">
        <div className="space-y-1 w-full sm:w-auto">
          <Label htmlFor="priority">Filtrer par priorité</Label>
          <Select value={priority} onValueChange={handlePriorityChange}>
            <SelectTrigger className="w-[180px] text-sm">
              <SelectValue placeholder="Priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">Haute</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Basse</SelectItem>
              {!hideAllOption && (
                <SelectItem value="all">Toutes (page dédiée)</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Bouton Réinitialiser */}
        <Button
          variant={"outline"}
          onClick={handleReset}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition w-full sm:w-auto"
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </Button>
      </div>
    </>
  );
};
