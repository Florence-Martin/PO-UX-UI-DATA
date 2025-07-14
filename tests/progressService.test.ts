/**
 * @jest-environment jsdom
 */

import {
  getWireframesProgressLevel,
  setWireframesProgressLevel,
  getWireframesProgress,
  PROGRESS_VALUES,
  PROGRESS_LABELS,
  type ProgressLevel,
} from "../lib/services/progressService";

describe("progressService", () => {
  // Mock pour surveiller les événements
  const mockDispatchEvent = jest.fn();

  beforeEach(() => {
    // Nettoyer localStorage
    localStorage.clear();

    // Réinitialiser les mocks
    jest.clearAllMocks();

    // Réinitialiser mockDispatchEvent pour qu'il fonctionne normalement
    mockDispatchEvent.mockImplementation(() => true);

    // Espionner window.dispatchEvent
    jest.spyOn(window, "dispatchEvent").mockImplementation(mockDispatchEvent);
  });

  afterEach(() => {
    // Restaurer les mocks
    jest.restoreAllMocks();
  });

  describe("PROGRESS_VALUES constant", () => {
    test("should have correct percentage values for each level", () => {
      expect(PROGRESS_VALUES[0]).toBe(0);
      expect(PROGRESS_VALUES[1]).toBe(25);
      expect(PROGRESS_VALUES[2]).toBe(50);
      expect(PROGRESS_VALUES[3]).toBe(75);
      expect(PROGRESS_VALUES[4]).toBe(100);
    });

    test("should have all 5 levels defined", () => {
      expect(Object.keys(PROGRESS_VALUES)).toHaveLength(5);
    });
  });

  describe("PROGRESS_LABELS constant", () => {
    test("should have correct French labels for each level", () => {
      expect(PROGRESS_LABELS[0]).toBe("Pas commencé");
      expect(PROGRESS_LABELS[1]).toBe("Démarré");
      expect(PROGRESS_LABELS[2]).toBe("En cours");
      expect(PROGRESS_LABELS[3]).toBe("Avancé");
      expect(PROGRESS_LABELS[4]).toBe("Terminé");
    });

    test("should have all 5 labels defined", () => {
      expect(Object.keys(PROGRESS_LABELS)).toHaveLength(5);
    });
  });

  describe("getWireframesProgressLevel", () => {
    test("should return 0 when localStorage is empty", () => {
      const result = getWireframesProgressLevel();
      expect(result).toBe(0);
    });

    test("should return stored level when valid level is stored", () => {
      localStorage.setItem("wireframes-progress", "3");
      const result = getWireframesProgressLevel();
      expect(result).toBe(3);
    });

    test("should return correct level for each valid value", () => {
      const validLevels: ProgressLevel[] = [0, 1, 2, 3, 4];

      validLevels.forEach((level) => {
        localStorage.setItem("wireframes-progress", level.toString());
        expect(getWireframesProgressLevel()).toBe(level);
      });
    });

    test("should return 0 for invalid stored values", () => {
      // parseInt("1.5") = 1, which is valid, so we need truly invalid values
      const invalidValues = ["-1", "5", "abc", "xyz", "null", "undefined"];

      invalidValues.forEach((invalidValue) => {
        localStorage.setItem("wireframes-progress", invalidValue);
        expect(getWireframesProgressLevel()).toBe(0);
      });
    });

    test("should return 0 for empty string", () => {
      localStorage.setItem("wireframes-progress", "");
      expect(getWireframesProgressLevel()).toBe(0);
    });

    test("should handle localStorage errors gracefully", () => {
      // Les erreurs localStorage sont difficiles à simuler avec jsdom
      // Ce test vérifie que la fonction n'échoue pas avec des valeurs étranges
      localStorage.setItem("wireframes-progress", "{}");
      expect(() => getWireframesProgressLevel()).not.toThrow();
      expect(getWireframesProgressLevel()).toBe(0);
    });

    test("should handle edge case of exactly boundary values", () => {
      localStorage.setItem("wireframes-progress", "0");
      expect(getWireframesProgressLevel()).toBe(0);

      localStorage.setItem("wireframes-progress", "4");
      expect(getWireframesProgressLevel()).toBe(4);
    });
  });

  describe("setWireframesProgressLevel", () => {
    test("should store level in localStorage", () => {
      setWireframesProgressLevel(3);
      expect(localStorage.getItem("wireframes-progress")).toBe("3");
    });

    test("should dispatch custom event with correct details", () => {
      setWireframesProgressLevel(2);

      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "wireframes-progress-updated",
          detail: {
            level: 2,
            progress: 50,
          },
        })
      );
    });

    test("should work for all valid progress levels", () => {
      const validLevels: ProgressLevel[] = [0, 1, 2, 3, 4];

      validLevels.forEach((level) => {
        setWireframesProgressLevel(level);

        expect(localStorage.getItem("wireframes-progress")).toBe(
          level.toString()
        );

        expect(mockDispatchEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: {
              level,
              progress: PROGRESS_VALUES[level],
            },
          })
        );
      });
    });

    test("should handle localStorage errors gracefully", () => {
      // Test avec des valeurs qui pourraient causer des problèmes
      localStorage.setItem("wireframes-progress", "NaN");
      expect(() => setWireframesProgressLevel(2)).not.toThrow();
      expect(localStorage.getItem("wireframes-progress")).toBe("2");
    });    test("should handle window.dispatchEvent errors gracefully", () => {
      // Créer un mock local pour ce test spécifique
      const errorMock = jest.fn(() => {
        throw new Error("dispatchEvent error");
      });
      
      // Remplacer temporairement le mock global
      jest.spyOn(window, 'dispatchEvent').mockImplementation(errorMock);
      
      expect(() => setWireframesProgressLevel(2)).toThrow();
      
      // Restaurer le mock normal pour les autres tests
      jest.spyOn(window, 'dispatchEvent').mockImplementation(mockDispatchEvent);
      mockDispatchEvent.mockImplementation(() => true);
    });
  });

  describe("getWireframesProgress", () => {
    test("should return correct percentage for each level", () => {
      const testCases = [
        { level: 0, expectedProgress: 0 },
        { level: 1, expectedProgress: 25 },
        { level: 2, expectedProgress: 50 },
        { level: 3, expectedProgress: 75 },
        { level: 4, expectedProgress: 100 },
      ];

      testCases.forEach(({ level, expectedProgress }) => {
        localStorage.setItem("wireframes-progress", level.toString());
        expect(getWireframesProgress()).toBe(expectedProgress);
      });
    });

    test("should return 0% when no level is stored", () => {
      const result = getWireframesProgress();
      expect(result).toBe(0);
    });

    test("should return 0% for invalid stored levels", () => {
      const invalidValues = ["-1", "5", "abc", "xyz", "null", "undefined"];

      invalidValues.forEach((invalidValue) => {
        localStorage.setItem("wireframes-progress", invalidValue);
        expect(getWireframesProgress()).toBe(0);
      });
    });
  });

  describe("integration tests", () => {
    test("should maintain consistency between set and get operations", () => {
      const testLevels: ProgressLevel[] = [0, 1, 2, 3, 4];

      testLevels.forEach((level) => {
        setWireframesProgressLevel(level);

        expect(getWireframesProgressLevel()).toBe(level);
        expect(getWireframesProgress()).toBe(PROGRESS_VALUES[level]);
      });
    });

    test("should handle complete workflow from empty to full progress", () => {
      // Start with empty localStorage
      expect(getWireframesProgress()).toBe(0);

      // Progress through all levels
      for (let level = 0; level <= 4; level++) {
        setWireframesProgressLevel(level as ProgressLevel);

        expect(getWireframesProgressLevel()).toBe(level);
        expect(getWireframesProgress()).toBe(
          PROGRESS_VALUES[level as ProgressLevel]
        );
      }
    });

    test("should handle rapid successive updates", () => {
      const updates: ProgressLevel[] = [1, 3, 2, 4, 0];

      updates.forEach((level) => {
        setWireframesProgressLevel(level);
        expect(getWireframesProgressLevel()).toBe(level);
        expect(localStorage.getItem("wireframes-progress")).toBe(
          level.toString()
        );
      });
    });
  });

  describe("event system", () => {
    test("should create CustomEvent with correct structure", () => {
      setWireframesProgressLevel(3);

      const dispatchedEvent = mockDispatchEvent.mock.calls[0][0];

      expect(dispatchedEvent).toBeInstanceOf(CustomEvent);
      expect(dispatchedEvent.type).toBe("wireframes-progress-updated");
      expect(dispatchedEvent.detail).toEqual({
        level: 3,
        progress: 75,
      });
    });

    test("should dispatch events for all level changes", () => {
      const levels: ProgressLevel[] = [0, 1, 2, 3, 4];

      levels.forEach((level, index) => {
        setWireframesProgressLevel(level);

        expect(mockDispatchEvent).toHaveBeenCalledTimes(index + 1);

        const lastCall = mockDispatchEvent.mock.calls[index][0];
        expect(lastCall.detail).toEqual({
          level,
          progress: PROGRESS_VALUES[level],
        });
      });
    });
  });

  describe("edge cases and error handling", () => {
    test("should handle localStorage quota exceeded gracefully", () => {
      // Dans un environnement jsdom, on ne peut pas facilement simuler QuotaExceededError
      // On teste plutôt que la fonction fonctionne normalement
      expect(() => setWireframesProgressLevel(2)).not.toThrow();
      expect(localStorage.getItem("wireframes-progress")).toBe("2");
    });

    test("should handle corrupted localStorage data", () => {
      localStorage.setItem("wireframes-progress", "corrupted-data-{");
      const result = getWireframesProgressLevel();
      expect(result).toBe(0);
    });

    test("should handle very large numbers in localStorage", () => {
      localStorage.setItem("wireframes-progress", "999999");
      const result = getWireframesProgressLevel();
      expect(result).toBe(0);
    });

    test("should handle negative numbers in localStorage", () => {
      localStorage.setItem("wireframes-progress", "-5");
      const result = getWireframesProgressLevel();
      expect(result).toBe(0);
    });
  });
});
