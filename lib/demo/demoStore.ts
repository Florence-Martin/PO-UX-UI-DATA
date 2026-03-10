/**
 * DemoStore - Stockage localStorage avec import Firestore
 *
 * Architecture hybride :
 * 1. Premier chargement (localStorage vide) → importFromFirestore()
 * 2. Toutes opérations ultérieures → localStorage uniquement
 * 3. Reset → clearSnapshot() puis re-import Firestore
 *
 * Garantie : En mode démo, AUCUNE écriture Firestore n'est jamais déclenchée
 */

const STORAGE_KEY = "demo_snapshot";
const METADATA_KEY = "demo_metadata";

export interface DemoMetadata {
  version: string;
  lastImport: string;
  source: "firestore" | "seed";
  collections: string[];
}

export class DemoStore {
  /**
   * Récupère toutes les données d'une collection
   */
  static getAll<T>(collection: string): T[] {
    const data = this.loadSnapshot();
    return (data[collection] || []) as T[];
  }

  /**
   * Récupère un document par ID
   */
  static getById<T>(collection: string, id: string): T | null {
    const items = this.getAll<T & { id: string }>(collection);
    return items.find((item) => item.id === id) || null;
  }

  /**
   * Crée un nouveau document
   */
  static create<T>(
    collection: string,
    data: Omit<T, "id">
  ): T & { id: string } {
    const snapshot = this.loadSnapshot();
    const items = snapshot[collection] || [];

    const newItem = {
      id: this.generateId(),
      ...data,
    } as T & { id: string };

    items.push(newItem);
    snapshot[collection] = items;

    this.saveSnapshot(snapshot);

    return newItem;
  }

  /**
   * Met à jour un document
   */
  static update<T>(collection: string, id: string, updates: Partial<T>): void {
    const snapshot = this.loadSnapshot();
    const items = snapshot[collection] || [];

    const index = items.findIndex((item: any) => item.id === id);
    if (index === -1) {
      throw new Error(`Document ${id} not found in ${collection}`);
    }

    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    snapshot[collection] = items;
    this.saveSnapshot(snapshot);
  }

  /**
   * Supprime un document
   */
  static remove(collection: string, id: string): void {
    const snapshot = this.loadSnapshot();
    const items = snapshot[collection] || [];

    snapshot[collection] = items.filter((item: any) => item.id !== id);
    this.saveSnapshot(snapshot);
  }

  /**
   * Importe les données depuis Firestore
   * Appelé au premier chargement ou lors du reset
   *
   * @param collections - Liste des collections à importer
   * @param fetchFunctions - Map collection → fonction fetch Firestore
   */
  static async importFromFirestore(
    collections: string[],
    fetchFunctions: Record<string, () => Promise<any[]>>
  ): Promise<void> {
    console.log("📥 Import Firestore → localStorage...");

    const snapshot: Record<string, any[]> = {};

    for (const collection of collections) {
      const fetchFn = fetchFunctions[collection];
      if (!fetchFn) {
        console.warn(`⚠️ Pas de fonction fetch pour ${collection}`);
        snapshot[collection] = [];
        continue;
      }

      try {
        const data = await fetchFn();
        snapshot[collection] = this.normalizeTimestamps(data);
        console.log(`✅ ${collection}: ${data.length} documents importés`);
      } catch (error) {
        console.error(`❌ Erreur import ${collection}:`, error);
        snapshot[collection] = [];
      }
    }

    this.saveSnapshot(snapshot);
    this.updateMetadata({
      source: "firestore",
      lastImport: new Date().toISOString(),
      collections,
    });

    console.log("✅ Import Firestore terminé");
  }

  /**
   * Normalise les Timestamps Firestore en ISO strings
   * Permet de stocker les dates en JSON localStorage
   */
  private static normalizeTimestamps(data: any[]): any[] {
    return data.map((item) => {
      const normalized = { ...item };

      // Champs de dates courants à normaliser
      const dateFields = [
        "createdAt",
        "updatedAt",
        "startDate",
        "endDate",
        "uploadedAt",
        "closedAt",
      ];

      dateFields.forEach((field) => {
        if (normalized[field]) {
          // Si c'est un Timestamp Firestore
          if (
            normalized[field].toDate &&
            typeof normalized[field].toDate === "function"
          ) {
            normalized[field] = normalized[field].toDate().toISOString();
          }
          // Si c'est déjà une Date
          else if (normalized[field] instanceof Date) {
            normalized[field] = normalized[field].toISOString();
          }
        }
      });

      return normalized;
    });
  }

  /**
   * Vérifie si un snapshot local existe
   */
  static hasSnapshot(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEY) !== null;
  }

  /**
   * Efface le snapshot local (utilisé lors du reset)
   */
  static clearSnapshot(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(METADATA_KEY);
  }

  /**
   * Charge le snapshot depuis localStorage
   */
  private static loadSnapshot(): Record<string, any[]> {
    if (typeof window === "undefined") return {};

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};

    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("❌ Erreur parsing snapshot:", error);
      return {};
    }
  }

  /**
   * Sauvegarde le snapshot dans localStorage
   */
  private static saveSnapshot(data: Record<string, any[]>): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("❌ Erreur sauvegarde snapshot:", error);

      // Si erreur de quota, essayer de libérer de l'espace
      if (
        error instanceof DOMException &&
        error.name === "QuotaExceededError"
      ) {
        throw new Error(
          "Espace localStorage insuffisant. Utilisez le bouton Reset."
        );
      }

      throw new Error("Erreur sauvegarde snapshot");
    }
  }

  /**
   * Met à jour les métadonnées du snapshot
   */
  private static updateMetadata(updates: Partial<DemoMetadata>): void {
    if (typeof window === "undefined") return;

    const existing = this.getMetadata();
    const metadata: DemoMetadata = {
      version: "1.0.0",
      lastImport: existing.lastImport || new Date().toISOString(),
      source: existing.source || "seed",
      collections: existing.collections || [],
      ...updates,
    };

    localStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
  }

  /**
   * Récupère les métadonnées du snapshot
   */
  static getMetadata(): DemoMetadata {
    if (typeof window === "undefined") {
      return {
        version: "1.0.0",
        lastImport: new Date().toISOString(),
        source: "seed",
        collections: [],
      };
    }

    const stored = localStorage.getItem(METADATA_KEY);
    if (!stored) {
      return {
        version: "1.0.0",
        lastImport: new Date().toISOString(),
        source: "seed",
        collections: [],
      };
    }

    try {
      return JSON.parse(stored);
    } catch {
      return {
        version: "1.0.0",
        lastImport: new Date().toISOString(),
        source: "seed",
        collections: [],
      };
    }
  }

  /**
   * Génère un ID unique (style Firestore)
   */
  static generateId(): string {
    return `demo_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Seed avec données par défaut (fallback si Firestore inaccessible)
   */
  static seedWithDefaults(defaultData: Record<string, any[]>): void {
    this.saveSnapshot(defaultData);
    this.updateMetadata({
      source: "seed",
      lastImport: new Date().toISOString(),
      collections: Object.keys(defaultData),
    });
    console.log("📦 Snapshot initialisé avec données fallback");
  }
}
