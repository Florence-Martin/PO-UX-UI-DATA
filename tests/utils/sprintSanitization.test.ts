/** @jest-environment jsdom */

import { sanitize } from "@/lib/utils/sprintSchema";

describe("sanitization of sprint fields", () => {
  it("preserves ordinary French text and harmless formatting", () => {
    expect(sanitize("Livrer <strong>l'amélioration</strong> à l'équipe"))
      .toBe("Livrer <strong>l'amélioration</strong> à l'équipe");
  });

  it("removes executable markup and event handlers", () => {
    const result = sanitize('<script>alert(1)</script><img src="x" onerror="alert(1)"><b>Objectif</b>');
    const container = document.createElement("div");
    container.innerHTML = result;
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("[onerror]")).toBeNull();
    expect(container.querySelector("b")?.textContent).toBe("Objectif");
  });

  it("removes JavaScript links without discarding their label", () => {
    const container = document.createElement("div");
    container.innerHTML = sanitize('<a href="javascript:alert(1)">Voir le sprint</a>');
    expect(container.querySelector("a")?.hasAttribute("href")).toBe(false);
    expect(container.textContent).toBe("Voir le sprint");
  });
});
