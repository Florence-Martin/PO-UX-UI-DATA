import { mkdir, writeFile } from "fs/promises";
import { POST } from "../../app/api/upload-wireframe/route";

jest.mock("fs/promises", () => ({
  mkdir: jest.fn(),
  writeFile: jest.fn(),
}));

describe("POST /api/upload-wireframe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function buildRequest(file: File | null, fileName: string | null) {
    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }

    if (fileName !== null) {
      formData.append("fileName", fileName);
    }

    return {
      formData: async () => formData,
    } as any;
  }

  it("uploads a valid png file", async () => {
    const file = new File([new Uint8Array([1, 2, 3])], "test.png", {
      type: "image/png",
    });

    const response = await POST(buildRequest(file, "test.png"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.url).toBe("/wireframes/test.png");
    expect(mkdir).toHaveBeenCalled();
    expect(writeFile).toHaveBeenCalled();
  });

  it("rejects missing file", async () => {
    const response = await POST(buildRequest(null, "test.png"));
    expect(response.status).toBe(400);
  });

  it("rejects svg extension", async () => {
    const file = new File([new Uint8Array([1])], "test.svg", {
      type: "image/svg+xml",
    });

    const response = await POST(buildRequest(file, "test.svg"));
    expect(response.status).toBe(400);
  });

  it("rejects invalid mime type", async () => {
    const file = new File([new Uint8Array([1])], "test.png", {
      type: "text/plain",
    });

    const response = await POST(buildRequest(file, "test.png"));
    expect(response.status).toBe(400);
  });

  it("rejects oversized file", async () => {
    const file = new File(
      [new Uint8Array(5 * 1024 * 1024 + 1)],
      "too-large.png",
      {
        type: "image/png",
      }
    );

    const response = await POST(buildRequest(file, "too-large.png"));
    expect(response.status).toBe(413);
  });

  it("rejects path traversal name", async () => {
    const file = new File([new Uint8Array([1])], "test.png", {
      type: "image/png",
    });

    const response = await POST(buildRequest(file, "../test.png"));
    expect(response.status).toBe(400);
  });

  it("rejects missing fileName", async () => {
    const file = new File([new Uint8Array([1])], "test.png", {
      type: "image/png",
    });

    const response = await POST(buildRequest(file, null));

    expect(response.status).toBe(400);
  });
});
