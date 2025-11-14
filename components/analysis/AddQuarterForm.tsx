"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { RoadmapQuarter } from "@/lib/types/roadmapQuarter";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { Badge } from "../ui/badge";

interface AddQuarterFormProps {
  onSubmit: (quarter: RoadmapQuarter) => Promise<void>;
  initialData?: RoadmapQuarter;
}

export function AddQuarterForm({ onSubmit, initialData }: AddQuarterFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [productVision, setProductVision] = useState(
    initialData?.productVision || ""
  );
  const [status, setStatus] = useState<RoadmapQuarter["status"]>(
    initialData?.status || "upcoming"
  );
  const [icon, setIcon] = useState(initialData?.icon || "FlagTriangleRight");
  const [iconColor, setIconColor] = useState(
    initialData?.iconColor || "text-muted-foreground"
  );
  const [items, setItems] = useState(initialData?.items || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddItem = () => {
    setItems([...items, { label: "", description: "" }]);
  };

  const handleItemChange = (
    index: number,
    field: "label" | "description",
    value: string
  ) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // Génération de l'ID basé sur le titre
  const generatedId = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const handleSubmit = async () => {
    if (!title.trim() || !productVision.trim()) {
      toast.error("Merci de remplir tous les champs obligatoires.");
      return;
    }

    setIsSubmitting(true);

    const newQuarter: RoadmapQuarter = {
      id: initialData?.id || generatedId,
      title: title.trim(),
      productVision: productVision.trim(),
      status,
      icon,
      iconColor,
      items,
      createdAt: initialData?.createdAt || Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    };

    await onSubmit(newQuarter);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4 p-4 max-h-[calc(90vh-6rem)] overflow-y-auto">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Titre du trimestre</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du trimestre"
          />
          <p className="text-xs text-muted-foreground">
            Exemple :{" "}
            <span className="italic">Q2 2025 – Wireframes & User Stories</span>
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="productVision">
            Vision produit <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="productVision"
            value={productVision}
            onChange={(e) => setProductVision(e.target.value)}
            placeholder="Pourquoi on le fait et où on va..."
          />
        </div>

        <div className="grid gap-2">
          {/* Aperçu du statut avec badge coloré */}
          <div className="flex items-center gap-2">
            <Label>Statut</Label>
            <Badge
              className={`text-xs capitalize ${
                status === "done"
                  ? "bg-green-500 text-white"
                  : status === "in-progress"
                    ? "bg-yellow-500 text-black"
                    : "bg-red-500 text-white"
              }`}
            >
              {status === "done"
                ? "Terminé"
                : status === "in-progress"
                  ? "En cours"
                  : "À faire"}
            </Badge>
          </div>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as RoadmapQuarter["status"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">À faire</SelectItem>
              <SelectItem value="in-progress">En cours</SelectItem>
              <SelectItem value="done">Terminé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Icône (Lucide)</Label>
          <Input value={icon} onChange={(e) => setIcon(e.target.value)} />
        </div>

        <div className="grid gap-2">
          <Label>Couleur de l’icône</Label>
          <Input
            value={iconColor}
            onChange={(e) => setIconColor(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Objectifs / livrables</Label>
          <p className="text-xs text-muted-foreground italic">
            Pour garantir la traçabilité, les objectifs ne peuvent pas être
            supprimés une fois créés.
          </p>
          {items.map((item, index) => (
            <div
              key={index}
              className="grid gap-1 border p-3 rounded-md relative"
            >
              <div className="grid gap-1">
                <Input
                  placeholder="Titre de l’item"
                  value={item.label}
                  onChange={(e) =>
                    handleItemChange(index, "label", e.target.value)
                  }
                />
                <Textarea
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            onClick={handleAddItem}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" /> Ajouter un item
          </Button>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-fit"
        >
          {isSubmitting
            ? "Enregistrement..."
            : initialData
              ? "Mettre à jour"
              : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}
