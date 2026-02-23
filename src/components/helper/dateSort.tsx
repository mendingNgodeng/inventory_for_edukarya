export function toTime(value: any): number {
  if (!value) return 0;
  const t = new Date(value).getTime();
  return Number.isFinite(t) ? t : 0;
}

export function sortByDate<T>(
  rows: T[],
  getDate: (row: T) => any,
  order: "ASC" | "DESC"
) {
  const dir = order === "ASC" ? 1 : -1;
  return [...rows].sort((a, b) => (toTime(getDate(a)) - toTime(getDate(b))) * dir);
}