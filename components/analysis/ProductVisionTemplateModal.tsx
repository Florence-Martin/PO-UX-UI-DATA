"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ProductVisionTemplateModalProps {
  className?: string;
}

interface ProductVisionTemplateModalProps {
  className?: string;
}

export default function ProductVisionTemplateModal({
  className,
}: ProductVisionTemplateModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-medium">
          Vision&nbsp;Produit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Vision Produit – Canevas</DialogTitle>
          <DialogDescription>
            Template de www.prodpad.com/vision-template
          </DialogDescription>
        </DialogHeader>

        {/* Template */}
        <div className="space-y-6 pt-4 text-base leading-relaxed">
          <p>
            <strong>For</strong>
            <span className="inline-block w-full border-b border-muted-foreground/40 align-middle mx-2"></span>
            <em>(cible)</em>
          </p>
          <p>
            <strong>Who</strong>
            <span className="inline-block w-full border-b border-muted-foreground/40 align-middle mx-2"></span>
            <em>(besoin / opportunité)</em>
          </p>
          <p>
            <strong>The</strong>
            <span className="inline-block w-24 border-b border-muted-foreground/40 align-middle mx-2"></span>
            <em>(nom du produit)</em>
            <span className="mx-2">is a</span>
            <span className="inline-block w-32 border-b border-muted-foreground/40 align-middle mx-2"></span>
            <em>(catégorie)</em>
          </p>
          <p>
            <strong>That</strong>
            <span className="inline-block w-full border-b border-muted-foreground/40 align-middle mx-2"></span>
            <em>(bénéfice clé)</em>
          </p>
          <p>
            <strong>Unlike</strong>
            <span className="inline-block w-full border-b border-muted-foreground/40 align-middle mx-2"></span>
            <em>(alternative principale)</em>
          </p>
          <p>
            <strong>Our product</strong>
            <span className="inline-block w-full border-b border-muted-foreground/40 align-middle mx-2"></span>
            <em>(différenciation clé)</em>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
