import { BaseWorkItem } from "./BaseWorkItem";
import { DoDItem } from "./dod";

export type MoscowKey =
  | "mustHave"
  | "shouldHave"
  | "couldHave"
  | "wontHave"
  | "";

export interface DoDProgress {
  codeReviewed: boolean;
  testsWritten: boolean;
  testedLocally: boolean;
  testedStaging: boolean;
  documentationUpdated: boolean;
  ticketDone: boolean;
}

export interface UserStory extends BaseWorkItem {
  id: string;
  code?: string;
  acceptanceCriteria: string;
  taskIds?: string[];
  moscow?: MoscowKey | null;
  sprintId?: string;
  badge?: "sprint" | "" | null;
  dodProgress?: DoDProgress; // ⚠️ DEPRECATED - Ancien système
  dodItems?: DoDItem[]; // 🆕 Nouveau système - DoD propre à chaque US
}
