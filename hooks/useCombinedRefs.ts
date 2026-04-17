import { RefCallback, useCallback, useEffect, useRef } from "react";

// Hook pour fusionner un ref local (avec .current) + setNodeRef (fonction)
export function useCombinedRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): RefCallback<T> {
  const refsRef = useRef(refs);

  useEffect(() => {
    refsRef.current = refs;
  }, [refs]);

  const combinedRef: RefCallback<T> = useCallback(
    (node: T | null) => {
      refsRef.current.forEach((ref) => {
        if (!ref) return;
        if (typeof ref === "function") {
          ref(node);
        } else if (typeof ref === "object" && ref !== null) {
          (ref as React.MutableRefObject<T | null>).current = node;
        }
      });
    },
    []
  );

  return combinedRef;
}
