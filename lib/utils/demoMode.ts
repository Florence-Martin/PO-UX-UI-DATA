const DEMO_METADATA_KEY = "demo_metadata";

export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;

  return (
    localStorage.getItem(DEMO_METADATA_KEY) !== null ||
    localStorage.getItem("demo_snapshot") !== null
  );
}
