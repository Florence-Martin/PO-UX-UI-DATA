"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Documentation() {
  return (
    <div className="grid gap-4 grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle>Éditeur de User Stories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Titre</Label>
            <Input placeholder="En tant que [rôle], je veux [action] afin de [bénéfice]" />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="Description détaillée de la user story..." />
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Priorité</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Story Points</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Estimation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="13">13</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Critères d&apos;Acceptation</Label>
            <Textarea
              placeholder="1. Étant donné [contexte], quand [action], alors [résultat attendu]"
              className="min-h-[150px]"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline">Annuler</Button>
            <Button>Sauvegarder</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
