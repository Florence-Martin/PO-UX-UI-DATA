"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { useUserStories } from "@/hooks/useUserStories";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSprintForm } from "@/hooks/useSprintForm";

export function SprintForm() {
  const {
    isOpen,
    closeModal,
    formValues,
    handleInputChange,
    handleDateChange,
    handleCheckboxChange,
    handleSubmit,
  } = useSprintForm();

  const { userStories } = useUserStories();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer un Sprint</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Titre du sprint */}
          <div>
            <Label htmlFor="title">Nom du Sprint</Label>
            <Input
              id="title"
              name="title"
              value={formValues.title}
              onChange={handleInputChange}
              placeholder="Sprint 24 - Avril"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Début</Label>
              <Calendar
                mode="single"
                selected={formValues.startDate}
                onSelect={(date) => handleDateChange("startDate", date)}
                locale={fr}
              />
              {formValues.startDate && (
                <p className="text-sm text-muted-foreground mt-1">
                  {format(formValues.startDate, "dd MMMM yyyy", { locale: fr })}
                </p>
              )}
            </div>

            <div>
              <Label>Fin</Label>
              <Calendar
                mode="single"
                selected={formValues.endDate}
                onSelect={(date) => handleDateChange("endDate", date)}
                locale={fr}
              />
              {formValues.endDate && (
                <p className="text-sm text-muted-foreground mt-1">
                  {format(formValues.endDate, "dd MMMM yyyy", { locale: fr })}
                </p>
              )}
            </div>
          </div>

          {/* Sélection des User Stories */}
          <div>
            <Label>Inclure les User Stories :</Label>
            <div className="max-h-60 overflow-y-auto mt-2 border p-3 rounded-md space-y-2">
              {userStories.map((story) => (
                <div key={story.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`us-${story.id}`}
                    checked={formValues.userStoryIds.includes(story.id!)}
                    onCheckedChange={() => handleCheckboxChange(story.id!)}
                  />
                  <Label
                    htmlFor={`us-${story.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {story.code} — {story.title}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <Button type="submit">Sauvegarder le Sprint</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
