import { useCallback } from "react";

export function useCombinedRefs<T>(...refs: any[]) {
  return useCallback(
    (node: T) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref != null) {
          ref.current = node;
        }
      });
    },
    [refs]
  );
}
