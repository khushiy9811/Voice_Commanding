import { getSeasonalItems } from "../data/seasonalItems";

// Frequency-based "running low" style recommendations: items the user has
// added often in the past but that aren't currently on the list.
export function getFrequentSuggestions(history, currentListNames, limit = 3) {
  const counts = {};
  for (const entry of history) {
    const name = entry.name.toLowerCase();
    counts[name] = (counts[name] || 0) + 1;
  }

  return Object.entries(counts)
    .filter(([name, count]) => count >= 2 && !currentListNames.has(name))
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({
      name,
      reason: `You've added ${name} ${count} times before — running low?`,
      type: "frequent",
    }));
}

// Seasonal / "on sale" recommendations for the current month.
export function getSeasonalSuggestions(currentListNames, date = new Date(), limit = 3) {
  return getSeasonalItems(date)
    .filter((name) => !currentListNames.has(name.toLowerCase()))
    .slice(0, limit)
    .map((name) => ({
      name,
      reason: `${name[0].toUpperCase() + name.slice(1)} is in season right now.`,
      type: "seasonal",
    }));
}

export function getAllSuggestions(history, currentList, date = new Date()) {
  const currentListNames = new Set(currentList.map((i) => i.name.toLowerCase()));
  return [
    ...getFrequentSuggestions(history, currentListNames),
    ...getSeasonalSuggestions(currentListNames, date),
  ];
}
