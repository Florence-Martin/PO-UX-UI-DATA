"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, CheckCheck, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import EditDoDDrawer from "./EditDodDrawver";
import ChecklistItem from "./ChecklistItem";
import { DoD, DoDItem } from "@/lib/types/dod";
import {
  getDoD,
  subscribeToDoDChanges,
  updateDoD,
  updateDoDItemStatus,
} from "@/lib/services/dodService";
import { Timestamp } from "firebase/firestore";
import { useActiveSprint } from "@/hooks/sprint";

interface DefinitionOfDoneProps {
  isAdmin?: boolean;
  userId?: string;
}

const DefinitionOfDone: React.FC<DefinitionOfDoneProps> = ({
  isAdmin = false,
  userId = "anonymous",
}) => {
  const [dod, setDod] = useState<DoD | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const { activeSprint } = useActiveSprint();

  const sprintLabel = activeSprint?.title || "Sprint actif";

  // Load DoD data on mount
  useEffect(() => {
    const unsubscribe = subscribeToDoDChanges("default", (dodData) => {
      setDod(dodData);
      setLoading(false);
      if (dodData.lastUpdated instanceof Timestamp) {
        setLastUpdated(dodData.lastUpdated.toDate().toLocaleString());
      } else if (typeof dodData.lastUpdated === "string") {
        setLastUpdated(new Date(dodData.lastUpdated).toLocaleString());
      } else {
        setLastUpdated(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleToggleItem = async (itemId: string, checked: boolean) => {
    if (!dod) return;

    setDod({
      ...dod,
      items: dod.items.map((item) =>
        item.id === itemId ? { ...item, checked } : item
      ),
    });

    try {
      await updateDoDItemStatus("default", itemId, checked, userId);
    } catch (error) {
      console.error("Error updating item:", error);
      setDod(await getDoD("default"));
    }
  };

  const handleSaveChanges = async (updatedItems?: DoDItem[]) => {
    if (!dod) return;

    setSaving(true);
    try {
      const itemsToSave = updatedItems || dod.items;
      await updateDoD({
        ...dod,
        items: itemsToSave,
        lastUpdatedBy: userId,
      });
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEditDrawer = () => {
    setIsEditDrawerOpen(true);
  };

  const calculateProgress = () => {
    if (!dod?.items.length) return 0;
    const checkedItems = dod.items.filter((item) => item.checked).length;
    return Math.round((checkedItems / dod.items.length) * 100);
  };

  if (loading) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="pt-6 flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCheck className="h-6 w-6 text-primary" />
                <CardTitle>Definition of Done</CardTitle>
              </div>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenEditDrawer}
                  className="flex items-center gap-1"
                >
                  <Pencil size={14} />
                  <span className="hidden sm:inline">Modifier</span>
                </Button>
              )}
            </div>
            <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
              <span>Checklist partagée pour</span>
              <Badge variant="outline" className="text-sm px-2 py-0.5">
                {sprintLabel}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-1">
              {dod?.items
                .sort((a, b) => a.order - b.order)
                .map((item, index) => (
                  <ChecklistItem
                    key={item.id}
                    item={item}
                    onToggle={handleToggleItem}
                    isAdmin={isAdmin}
                    delay={index}
                  />
                ))}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-muted-foreground border-t pt-4">
            <div>
              {lastUpdated && <p>Dernière mise à jour: {lastUpdated}</p>}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm">{calculateProgress()}% complet</p>
              {isAdmin && (
                <Button
                  size="sm"
                  disabled={saving}
                  onClick={() => handleSaveChanges()}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      <EditDoDDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        items={dod?.items || []}
        onSave={handleSaveChanges}
      />
    </>
  );
};

export default DefinitionOfDone;
