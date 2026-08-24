import { getSubstitutes } from "../data/substitutesMap";

// Given a parsed "substitute" intent, resolve concrete substitute options.
// Falls back to the substitutes map for the base item if the user didn't
// explicitly name a preferred alternative.
export function resolveSubstitutes({ item, preferredItem }) {
  if (preferredItem) {
    return {
      base: item,
      options: [preferredItem],
      reason: `Noted — we'll suggest ${preferredItem} instead of ${item}.`,
    };
  }

  const options = item ? getSubstitutes(item) : [];
  return {
    base: item,
    options,
    reason: options.length
      ? `${item} is unavailable. Try: ${options.join(", ")}.`
      : `${item || "That item"} is unavailable and we don't have a suggested substitute yet.`,
  };
}
