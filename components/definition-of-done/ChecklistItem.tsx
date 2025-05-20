import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { DoDItem } from "@/lib/types/dod";

interface ChecklistItemProps {
  item: DoDItem;
  onToggle: (id: string, checked: boolean) => void;
  isAdmin: boolean;
  delay?: number;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  item,
  onToggle,
  isAdmin,
  delay = 0,
}) => {
  return (
    <motion.div
      className="flex items-start space-x-2 py-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.1 }}
    >
      <Checkbox
        id={`checkbox-${item.id}`}
        checked={item.checked}
        onCheckedChange={(checked) => onToggle(item.id, checked === true)}
        className="mt-1"
        disabled={!isAdmin}
      />
      <Label
        htmlFor={`checkbox-${item.id}`}
        className={cn(
          "text-sm leading-tight cursor-pointer flex-1",
          item.checked && "text-muted-foreground line-through"
        )}
      >
        {item.text}
      </Label>
    </motion.div>
  );
};

export default ChecklistItem;
