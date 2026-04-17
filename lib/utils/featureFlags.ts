function isEnabled(value: string | undefined): boolean {
  return value === "true";
}

export function isFirebaseAnalyticsEnabled(): boolean {
  return isEnabled(process.env.NEXT_PUBLIC_ENABLE_FIREBASE_ANALYTICS);
}
