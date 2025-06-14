import { formatDateToFrenchString } from "../lib/utils/formatDateToFrenchString";

describe("formatDateToFrenchString", () => {
  it("should format the date correctly", () => {
    const date = new Date("2023-03-15T12:00:00Z");
    expect(formatDateToFrenchString(date.toISOString())).toBe("15 mars 2023");
  });
});
