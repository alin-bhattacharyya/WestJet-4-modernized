const parseDate = (value) => (value ? new Date(`${value}T12:00:00`) : null);

/** "2026-11-09" -> "9 Nov 2026" */
export const fieldDate = (value) =>
  parseDate(value)?.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }) || "";

/** "2026-11-09" -> "Monday" */
export const weekday = (value) =>
  parseDate(value)?.toLocaleDateString("en-CA", { weekday: "long" }) || "";
