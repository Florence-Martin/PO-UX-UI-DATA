export function formatDateToFrenchString(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
