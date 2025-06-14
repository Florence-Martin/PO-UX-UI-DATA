import { formatSprintDates } from "../lib/utils/formatSprintDates";
import { Timestamp } from "firebase/firestore";

describe("formatSprintDates", () => {
  // Helper pour créer des timestamps
  const createTimestamp = (
    year: number,
    month: number,
    day: number
  ): Timestamp => {
    const date = new Date(year, month - 1, day); // Mois en JS commence à 0
    return Timestamp.fromDate(date);
  };

  test("devrait formater deux dates du même mois", () => {
    const startDate = createTimestamp(2023, 3, 15); // 15 mars 2023
    const endDate = createTimestamp(2023, 3, 28); // 28 mars 2023

    const result = formatSprintDates(startDate, endDate);

    expect(result).toBe("Mar 15-28");
  });

  test("devrait formater deux dates de mois différents", () => {
    const startDate = createTimestamp(2023, 3, 25); // 25 mars 2023
    const endDate = createTimestamp(2023, 4, 7); // 7 avril 2023

    const result = formatSprintDates(startDate, endDate);

    expect(result).toBe("Mar 25 - Apr 7");
  });

  test("devrait gérer le changement d'année", () => {
    const startDate = createTimestamp(2023, 12, 25); // 25 décembre 2023
    const endDate = createTimestamp(2024, 1, 7); // 7 janvier 2024

    const result = formatSprintDates(startDate, endDate);

    expect(result).toBe("Dec 25 - Jan 7");
  });

  test("devrait gérer des dates consécutives du même mois", () => {
    const startDate = createTimestamp(2023, 5, 1); // 1 mai 2023
    const endDate = createTimestamp(2023, 5, 2); // 2 mai 2023

    const result = formatSprintDates(startDate, endDate);

    expect(result).toBe("May 1-2");
  });

  test("devrait gérer des dates consécutives de mois différents", () => {
    const startDate = createTimestamp(2023, 5, 31); // 31 mai 2023
    const endDate = createTimestamp(2023, 6, 1); // 1 juin 2023

    const result = formatSprintDates(startDate, endDate);

    expect(result).toBe("May 31 - Jun 1");
  });
});
