export const CATEGORY_COLORS = {
  All: { dot: "#1e1e1e", bg: "#f1f5f9", text: "#1e1e1e" },
  Bangladesh: { dot: "#b91c1c", bg: "#fef2f2", text: "#b91c1c" },
  International: { dot: "#0284c7", bg: "#f0f9ff", text: "#0369a1" },
  Politics: { dot: "#b91c1c", bg: "#fef2f2", text: "#b91c1c" },
  Business: { dot: "#7c3aed", bg: "#f5f3ff", text: "#6d28d9" },
  Technology: { dot: "#0d9488", bg: "#f0fdfa", text: "#0f766e" },
  AI: { dot: "#2563eb", bg: "#eff6ff", text: "#1d4ed8" },
  Sports: { dot: "#16a34a", bg: "#f0fdf4", text: "#15803d" },
  Entertainment: { dot: "#db2777", bg: "#fdf2f8", text: "#be185d" },
  Health: { dot: "#0891b2", bg: "#ecfeff", text: "#0e7490" },
  Science: { dot: "#ea580c", bg: "#fff7ed", text: "#c2410c" },
  Lifestyle: { dot: "#84cc16", bg: "#f7fee7", text: "#4d7c0f" },
};

/**
 * Returns color codes associated with a news category.
 * @param {string} category - Category name
 * @returns {object} { dot, bg, text }
 */
export function getCatColor(category) {
  return CATEGORY_COLORS[category] || { dot: "#d97706", bg: "#fffbeb", text: "#b45309" };
}

/**
 * Formats a Date object or date-string into a readable format.
 * @param {string|Date} dateVal - Date input
 * @param {object} [options] - Optional layout settings for toLocaleDateString
 * @returns {string} Formatted date string
 */
export const formatDate = (dateVal, options = { month: "long", day: "numeric", year: "numeric" }) => {
  if (!dateVal) return "Unknown Date";
  try {
    return new Date(dateVal).toLocaleDateString("en-US", options);
  } catch {
    return "Unknown Date";
  }
};
