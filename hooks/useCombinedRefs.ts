import { useCallback, useRef, RefCallback } from "react";

// Hook pour fusionner un ref local (avec .current) + setNodeRef (fonction)
export function useCombinedRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): RefCallback<T> & { current: T | null } {
  const targetRef = useRef<T | null>(null);

  const combinedRef: RefCallback<T> = useCallback(
    (node: T | null) => {
      targetRef.current = node;

      refs.forEach((ref) => {
        if (!ref) return;
        if (typeof ref === "function") {
          ref(node);
        } else if (typeof ref === "object" && ref !== null) {
          (ref as React.MutableRefObject<T | null>).current = node;
        }
      });
    },
    [refs]
  );

  return Object.assign(combinedRef, { current: targetRef.current });
}
