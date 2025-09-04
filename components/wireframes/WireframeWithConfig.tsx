"use client";

import { WireframeConfig } from "@/components/wireframes/WireframeConfig";
import { WireframeGridSimplified } from "@/components/wireframes/WireframeGridSimplified";
import { useWireframeGrid } from "@/hooks/useWireframeGrid";
import { WireframeImage } from "@/lib/services/wireframeService";

interface WireframeWithConfigProps {
  gridId?: string;
  onImageChange?: (
    row: number,
    col: number,
    image: WireframeImage | null
  ) => void;
}

export function WireframeWithConfig({
  gridId,
  onImageChange,
}: WireframeWithConfigProps) {
  const {
    grid,
    images,
    isLoading,
    error,
    handleImageUpload,
    removeImage,
    updateGridConfig,
  } = useWireframeGrid(gridId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Chargement de la grille...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600 mb-2">❌ {error}</p>
        <button onClick={() => window.location.reload()}>Recharger</button>
      </div>
    );
  }

  if (!grid) {
    return (
      <div className="text-center p-4">
        <p>Aucune grille trouvée</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
      {/* Grille principale */}
      <div className="lg:col-span-3">
        <WireframeGridSimplified
          gridId={gridId}
          onImageChange={onImageChange}
        />
      </div>

      {/* Configuration */}
      <div className="space-y-4">
        <WireframeConfig
          grid={grid}
          onConfigUpdate={updateGridConfig}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
