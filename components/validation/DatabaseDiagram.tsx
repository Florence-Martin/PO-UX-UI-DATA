"use client";

import Image from "next/image";

export function DatabaseDiagram() {
  return (
    <div className="border rounded-lg p-4 bg-muted">
      <h3 className="text-lg font-bold mb-2">Diagramme de Données</h3>
      <p className="text-sm text-muted-foreground mb-4">
        En cours de réalisation. Un diagramme de classe sera ajouté pour
        visualiser la structure de données de l&apos;application. Il sera généré
        automatiquement à partir du code source et mis à jour régulièrement pour
        refléter les modifications apportées au modèle de données. Cela
        facilitera la compréhension des relations entre les différentes entités
        et aidera à la validation des données.
      </p>
      <div className="overflow-x-auto">
        <Image
          src="/software-engineer.svg"
          alt="Diagramme de données"
          width={900} // adapte en fonction de ton image
          height={600}
          className="mx-auto rounded-lg shadow-md"
        />
      </div>
    </div>
  );
}
