import React, { useState, useEffect } from "react";
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Grip, Trash2, Plus, Save } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { nanoid } from "@/lib/utils";
import { DoDItem } from "@/lib/types/dod";

interface EditDoDDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: DoDItem[];
  onSave: (items: DoDItem[]) => void;
}

const EditDoDDrawer: React.FC<EditDoDDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onSave,
}) => {
  const [editableItems, setEditableItems] = useState<DoDItem[]>([]);

  // Reset items when drawer opens
  useEffect(() => {
    if (isOpen) {
      setEditableItems([...items].sort((a, b) => a.order - b.order));
    }
  }, [isOpen, items]);

  // Handle drag and drop reordering
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(editableItems);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    // Update order property
    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      order: index,
    }));

    setEditableItems(updatedItems);
  };

  // Add a new item
  const handleAddItem = () => {
    const newItem: DoDItem = {
      id: nanoid(),
      text: "",
      checked: false,
      order: editableItems.length,
    };
    setEditableItems([...editableItems, newItem]);
  };

  // Remove an item
  const handleRemoveItem = (id: string) => {
    const updatedItems = editableItems
      .filter((item) => item.id !== id)
      .map((item, index) => ({ ...item, order: index }));
    setEditableItems(updatedItems);
  };

  // Update item text
  const handleUpdateItemText = (id: string, text: string) => {
    const updatedItems = editableItems.map((item) => {
      if (item.id === id) {
        return { ...item, text };
      }
      return item;
    });
    setEditableItems(updatedItems);
  };

  // Save changes
  const handleSave = () => {
    // Filter out empty items
    const validItems = editableItems.filter(
      (item) => item.text.trim().length > 0
    );
    onSave(validItems);
    onClose();
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] h-[90%] mt-24 fixed bottom-0 left-0 right-0">
          <div className="p-4 bg-muted/40 rounded-t-[10px] flex-1 overflow-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/50 mb-8" />

            <div className="container max-w-lg mx-auto">
              <h3 className="text-lg font-semibold mb-4">
                Modifier la Definition of Done
              </h3>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="dod-items">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {editableItems.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center gap-2 bg-card p-2 rounded-md border"
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab text-muted-foreground"
                              >
                                <Grip size={20} />
                              </div>
                              <Input
                                value={item.text}
                                onChange={(e) =>
                                  handleUpdateItemText(item.id, e.target.value)
                                }
                                placeholder="Élément de la checklist"
                                className="flex-1"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-destructive"
                              >
                                <Trash2 size={18} />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleAddItem}
                  className="flex items-center gap-1"
                >
                  <Plus size={16} /> Ajouter
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex items-center gap-1"
                >
                  <Save size={16} /> Sauvegarder
                </Button>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default EditDoDDrawer;
