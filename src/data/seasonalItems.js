// Static seasonal / "on sale" suggestion table keyed by month (0 = January).
// Loosely modeled on Northern Hemisphere seasonal produce availability.
export const SEASONAL_ITEMS = {
  0: ["orange", "spinach", "carrot"], // January
  1: ["orange", "broccoli", "cabbage"], // February
  2: ["strawberry", "lettuce", "peas"], // March
  3: ["mango", "spinach", "asparagus"], // April
  4: ["mango", "watermelon", "cucumber"], // May
  5: ["watermelon", "mango", "corn"], // June
  6: ["watermelon", "grape", "tomato"], // July
  7: ["grape", "peach", "capsicum"], // August
  8: ["apple", "grape", "pumpkin"], // September
  9: ["apple", "pumpkin", "sweet potato"], // October
  10: ["orange", "sweet potato", "cranberry"], // November
  11: ["orange", "pomegranate", "cranberry"], // December
};

export function getSeasonalItems(date = new Date()) {
  return SEASONAL_ITEMS[date.getMonth()] || [];
}
