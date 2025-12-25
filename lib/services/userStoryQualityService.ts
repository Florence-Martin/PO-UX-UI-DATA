import {
  UserStoryQualityResponse,
  UserStoryQualityResult,
} from "@/lib/ai/types";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";

const COLLECTION_NAME = "userStoryQualityAnalyses";

/**
 * Service Firestore pour persister les analyses de qualité (optionnel)
 */
export class UserStoryQualityService {
  /**
   * Sauvegarder une analyse dans Firestore
   */
  static async saveAnalysis(
    userStoryId: string,
    analysis: UserStoryQualityResponse,
    version: string = "v1.0.0"
  ): Promise<string> {
    try {
      const analysisRef = doc(collection(db, COLLECTION_NAME));
      const analysisId = analysisRef.id;

      const data: Omit<UserStoryQualityResult, "id" | "createdAt"> & {
        createdAt: Timestamp;
      } = {
        userStoryId,
        analysis,
        version,
        createdAt: Timestamp.now(),
      };

      await setDoc(analysisRef, data);
      console.log("✅ Analyse sauvegardée:", analysisId);

      return analysisId;
    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde de l'analyse:", error);
      throw new Error("Impossible de sauvegarder l'analyse");
    }
  }

  /**
   * Récupérer une analyse par ID
   */
  static async getAnalysisById(
    analysisId: string
  ): Promise<UserStoryQualityResult | null> {
    try {
      const analysisRef = doc(db, COLLECTION_NAME, analysisId);
      const snapshot = await getDoc(analysisRef);

      if (!snapshot.exists()) {
        return null;
      }

      const data = snapshot.data();
      return {
        id: snapshot.id,
        userStoryId: data.userStoryId,
        analysis: data.analysis,
        version: data.version,
        createdAt: data.createdAt.toDate(),
      };
    } catch (error) {
      console.error("❌ Erreur lors de la récupération de l'analyse:", error);
      throw new Error("Impossible de récupérer l'analyse");
    }
  }

  /**
   * Récupérer la dernière analyse pour une User Story donnée
   */
  static async getLatestAnalysisForUserStory(
    userStoryId: string
  ): Promise<UserStoryQualityResult | null> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("userStoryId", "==", userStoryId),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();

      return {
        id: doc.id,
        userStoryId: data.userStoryId,
        analysis: data.analysis,
        version: data.version,
        createdAt: data.createdAt.toDate(),
      };
    } catch (error) {
      console.error(
        "❌ Erreur lors de la récupération de la dernière analyse:",
        error
      );
      throw new Error("Impossible de récupérer la dernière analyse");
    }
  }

  /**
   * Récupérer toutes les analyses pour une User Story (historique)
   */
  static async getAnalysisHistory(
    userStoryId: string
  ): Promise<UserStoryQualityResult[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("userStoryId", "==", userStoryId),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userStoryId: data.userStoryId,
          analysis: data.analysis,
          version: data.version,
          createdAt: data.createdAt.toDate(),
        };
      });
    } catch (error) {
      console.error(
        "❌ Erreur lors de la récupération de l'historique:",
        error
      );
      throw new Error("Impossible de récupérer l'historique");
    }
  }

  /**
   * Supprimer une analyse
   */
  static async deleteAnalysis(analysisId: string): Promise<void> {
    try {
      const analysisRef = doc(db, COLLECTION_NAME, analysisId);
      await setDoc(analysisRef, { deleted: true }, { merge: true });
      console.log("✅ Analyse marquée comme supprimée:", analysisId);
    } catch (error) {
      console.error("❌ Erreur lors de la suppression de l'analyse:", error);
      throw new Error("Impossible de supprimer l'analyse");
    }
  }
}
