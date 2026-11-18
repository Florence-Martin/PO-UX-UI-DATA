import { sprintSchema } from "@/lib/utils/sprintSchema";

const validSprint = {
  title: "Sprint de livraison",
  startDate: new Date("2026-11-18T00:00:00Z"),
  endDate: new Date("2026-12-02T00:00:00Z"),
  userStoryIds: ["story-1"],
};

describe("sprint form validation", () => {
  it("accepts a valid sprint", () => {
    expect(sprintSchema.validate(validSprint).error).toBeUndefined();
  });

  it("rejects an end date before the start date", () => {
    expect(sprintSchema.validate({ ...validSprint, endDate: new Date("2026-11-17") }).error)
      .toBeDefined();
  });

  it.each(["", "ab", "a".repeat(101)])("rejects a title outside the allowed length (%s)", (title) => {
    expect(sprintSchema.validate({ ...validSprint, title }).error).toBeDefined();
  });

  it("requires story identifiers to be strings", () => {
    expect(sprintSchema.validate({ ...validSprint, userStoryIds: [{}] }).error).toBeDefined();
  });
});
