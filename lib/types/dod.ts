// Types for Definition of Done component
import { Timestamp } from "firebase/firestore";

export interface DoD {
  id: string;
  items: DoDItem[];
  lastUpdated: Timestamp;
  lastUpdatedBy: string;
}

export interface DoDItem {
  id: string;
  text: string;
  checked: boolean;
  order: number;
}
