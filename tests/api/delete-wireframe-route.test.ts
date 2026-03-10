import { unlink } from "fs/promises";
import { DELETE } from "../../app/api/delete-wireframe/route";

jest.mock("fs/promises", () => ({
  unlink: jest.fn(),
}));

describe("DELETE /api/delete-wireframe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function buildRequest(fileName: string) {
    return {
      json: async () => ({ fileName }),
    } as Request;
  }

  it("deletes a valid file", async () => {
    (unlink as jest.Mock).mockResolvedValue(undefined);

    const response = await DELETE(buildRequest("test.png"));
    expect(response.status).toBe(200);
  });

  it("rejects invalid filename", async () => {
    const response = await DELETE(buildRequest("../test.png"));
    expect(response.status).toBe(400);
  });

  it("rejects svg extension", async () => {
    const response = await DELETE(buildRequest("test.svg"));
    expect(response.status).toBe(400);
  });

  it("returns 404 when file does not exist", async () => {
    (unlink as jest.Mock).mockRejectedValue({ code: "ENOENT" });

    const response = await DELETE(buildRequest("test.png"));
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toContain("Fichier introuvable");
  });

  it("returns 500 on unexpected fs error", async () => {
    (unlink as jest.Mock).mockRejectedValue(new Error("fs failure"));

    const response = await DELETE(buildRequest("test.png"));
    expect(response.status).toBe(500);
  });
});
