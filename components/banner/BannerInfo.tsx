"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const BannerInfo = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: 200 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <Alert className="relative flex items-start gap-3 px-4 py-3 sm:px-6 sm:py-4 bg-muted text-muted-foreground border border-border rounded-md shadow-md">
            <Info className="w-5 h-5 text-primary mt-1" />
            <AlertDescription className="text-sm sm:text-base leading-snug">
              <strong>Démo interactive</strong> — Les données saisies sont
              enregistrées dans une base Firebase publique. <br />
              <em>Merci de ne pas renseigner de données personnelles.</em>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
