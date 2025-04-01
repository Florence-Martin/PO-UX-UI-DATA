"use client";

import { Card, CardContent } from "@/components/ui/card";
import scrumStepsData from "@/data/scrumSteps.json";
import { motion } from "framer-motion";

export default function ScrumSteps() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {scrumStepsData.map((item, index) => (
        <motion.div
          key={item.term}
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: index * 0.3,
            duration: 0.6,
            ease: "easeOut",
          }}
        >
          <Card className="h-44 flex flex-col justify-between bg-muted">
            <CardContent className="p-4">
              <p className="text-lg font-semibold">🔹 {item.term}</p>
              <p className="text-muted-foreground text-sm mt-2 line-clamp-4">
                {item.definition}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
