import { CATEGORY_MAP, FALLBACK_CATEGORY } from "../data/categoryMap";

// Very small singularizer for common plural forms so "apples" matches "apple".
function singularize(word) {
  if (word.endsWith("ies")) return word.slice(0, -3) + "y";
  if (word.endsWith("es") && !word.endsWith("ses")) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

export function categorize(itemName) {
  const normalized = itemName.toLowerCase().trim();
  if (CATEGORY_MAP[normalized]) return CATEGORY_MAP[normalized];

  const singular = singularize(normalized);
  if (CATEGORY_MAP[singular]) return CATEGORY_MAP[singular];

  // Try matching on the last word (e.g. "green apple" -> "apple").
  const words = normalized.split(" ");
  const lastWord = singularize(words[words.length - 1]);
  if (CATEGORY_MAP[lastWord]) return CATEGORY_MAP[lastWord];

  return FALLBACK_CATEGORY;
}
