import { NextRequest } from "next/server";
import { POST } from "@/app/api/ai/us-quality/route";
import { UserStoryQualityResponseSchema } from "@/lib/ai/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const validBody = {
  title: "Consulter le backlog",
  description: "En tant que PO, je consulte les tâches du backlog.",
  acceptanceCriteria: "Les tâches sont affichées dans leur ordre de priorité.",
};

function request(body: unknown) {
  return new NextRequest("http://localhost/api/ai/us-quality", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/ai/us-quality with Zod 4", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => jest.restoreAllMocks());

  it("returns a validated analysis for a valid request", async () => {
    const response = await POST(request(validBody));
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(UserStoryQualityResponseSchema.safeParse(body.data.analysis).success).toBe(true);
  });

  it("returns field issues and HTTP 400 for invalid input", async () => {
    const response = await POST(request({ ...validBody, title: "" }));
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.details).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: ["title"], message: "Le titre est requis" }),
    ]));
  });

  it("rejects oversized text before generating an analysis", async () => {
    const response = await POST(request({ ...validBody, description: "a".repeat(20001) }));
    expect(response.status).toBe(400);
  });

  it("rejects oversized collections in AI responses", () => {
    const result = UserStoryQualityResponseSchema.safeParse({
      scores: { clarity: 7, testability: 6, risk: 3 },
      alerts: [],
      questionsForBusiness: Array(51).fill("Question"),
      gherkinSuggestions: [],
    });
    expect(result.success).toBe(false);
  });

  it("keeps the React Hook Form resolver compatible with Zod 4", async () => {
    const resolver = zodResolver(z.object({ title: z.string().min(1) }));
    const result = await resolver({ title: "" }, {}, { fields: {}, shouldUseNativeValidation: false });
    expect(result.errors).toHaveProperty("title.message");
  });
});
