import { Timestamp } from "firebase/firestore";

/**
 * Formate les dates d'un sprint en affichant "Mar 28-29" ou "Mar 30 - Apr 4".
 */
export function formatSprintDates(
  startDate: Timestamp,
  endDate: Timestamp
): string {
  const start = startDate.toDate();
  const end = endDate.toDate();

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  const startMonth = start.toLocaleDateString("en-US", { month: "short" });
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });

  const startDay = start.getDate();
  const endDay = end.getDate();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}`;
  }

  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
}
