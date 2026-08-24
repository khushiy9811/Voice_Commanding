// Rule-based intent parser: turns a raw speech transcript into a structured
// command. Deliberately dependency-free (regex + keyword maps) so the app
// works fully offline with zero API keys — see README for the optional
// LLM-fallback extension point.

const NUMBER_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  a: 1, an: 1,
  // Hindi number words (demo multilingual support)
  एक: 1, दो: 2, तीन: 3, चार: 4, पांच: 5,
};

const UNIT_WORDS = [
  "bottles?", "packs?", "cans?", "boxes?", "bags?", "cartons?",
  "dozen", "kg", "kilograms?", "grams?", "liters?", "litres?",
  "pounds?", "lbs?",
];
const UNIT_PATTERN = new RegExp(`\\b(${UNIT_WORDS.join("|")})\\b`, "i");

// Verb/phrase -> intent maps. Order inside each list doesn't matter; longer
// phrases are checked before single words via sorting by length below.
const ADD_PHRASES = [
  "add", "i need", "need", "i want to buy", "i want", "want",
  "buy", "get me", "get", "put", "i'd like", "i would like",
  "जोड़ो", "जोड़ें", "चाहिए", "खरीदना है",
];
const REMOVE_PHRASES = [
  "remove", "take off", "take out", "delete", "erase", "cancel",
  "get rid of",
  "हटाओ", "हटाएं", "निकालो",
];
const SEARCH_PHRASES = [
  "find me", "find", "search for", "search", "look for", "show me",
  "ढूंढो", "खोजो",
];
const SUBSTITUTE_TRIGGER = /(unavailable|out of stock|don'?t have|instead of|prefer .+ instead|no more)/i;

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .replace(/\$/g, " $")
    .replace(/\s+/g, " ")
    .trim();
}

function matchPhrase(text, phrases) {
  const sorted = [...phrases].sort((a, b) => b.length - a.length);
  for (const phrase of sorted) {
    const re = new RegExp(`(^|\\s)${phrase}(\\s|$)`, "i");
    if (re.test(text)) return phrase;
  }
  return null;
}

function stripLeadingFillers(text) {
  return text
    .replace(/^(please|can you|could you|i would like to|i'd like to)\s+/i, "")
    .trim();
}

// Extract "N unit of item" / "N item" -> { quantity, unit, rest }
function extractQuantity(text) {
  let quantity = 1;
  let unit = null;
  let rest = text;

  const digitMatch = text.match(/\b(\d+)\b/);
  const wordMatch = text.match(
    new RegExp(`\\b(${Object.keys(NUMBER_WORDS).join("|")})\\b`, "i")
  );

  if (digitMatch) {
    quantity = parseInt(digitMatch[1], 10);
    rest = rest.replace(digitMatch[0], " ");
  } else if (wordMatch) {
    quantity = NUMBER_WORDS[wordMatch[1].toLowerCase()];
    rest = rest.replace(wordMatch[0], " ");
  }

  const unitMatch = rest.match(UNIT_PATTERN);
  if (unitMatch) {
    unit = unitMatch[1].replace(/s$/, "");
    rest = rest.replace(unitMatch[0], " ");
  }

  rest = rest.replace(/\bof\b/gi, " ").replace(/\s+/g, " ").trim();
  return { quantity, unit, rest };
}

// Extract price filter: "under $5", "below 5 dollars", "between 2 and 5"
function extractPriceFilter(text) {
  const under = text.match(/(?:under|below|less than)\s*\$?(\d+(?:\.\d+)?)/i);
  const over = text.match(/(?:over|above|more than)\s*\$?(\d+(?:\.\d+)?)/i);
  const between = text.match(
    /between\s*\$?(\d+(?:\.\d+)?)\s*(?:and|-)\s*\$?(\d+(?:\.\d+)?)/i
  );

  const filter = {};
  if (between) {
    filter.minPrice = parseFloat(between[1]);
    filter.maxPrice = parseFloat(between[2]);
  } else {
    if (under) filter.maxPrice = parseFloat(under[1]);
    if (over) filter.minPrice = parseFloat(over[1]);
  }
  filter.organicOnly = /\borganic\b/i.test(text);
  return filter;
}

function cleanItemName(text, matchedPhrase) {
  let cleaned = text;
  if (matchedPhrase) {
    cleaned = cleaned.replace(
      new RegExp(`(^|\\s)${matchedPhrase}(\\s|$)`, "i"),
      " "
    );
  }
  cleaned = cleaned
    .replace(/\b(to|from|my|the|list|a|an)\b/gi, " ")
    .replace(/under\s*\$?\d+(\.\d+)?/gi, " ")
    .replace(/below\s*\$?\d+(\.\d+)?/gi, " ")
    .replace(/over\s*\$?\d+(\.\d+)?/gi, " ")
    .replace(/more than\s*\$?\d+(\.\d+)?/gi, " ")
    .replace(/less than\s*\$?\d+(\.\d+)?/gi, " ")
    .replace(/between\s*\$?\d+(\.\d+)?\s*(and|-)\s*\$?\d+(\.\d+)?/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned;
}

export function parseIntent(rawTranscript, lang = "en-US") {
  const original = rawTranscript || "";
  const text = stripLeadingFillers(normalize(original));

  if (!text) {
    return { intent: "unknown", item: null, quantity: 1, language: lang, raw: original };
  }

  // Substitute / preference trigger takes priority — it can appear alongside
  // add/remove language ("milk is unavailable, suggest almond milk").
  if (SUBSTITUTE_TRIGGER.test(text)) {
    const preferMatch = text.match(/prefer\s+(.+?)\s+instead(?:\s+of\s+(.+))?/i);
    const item = preferMatch ? (preferMatch[2] || preferMatch[1]).trim() : cleanItemName(text, null);
    return {
      intent: "substitute",
      item: item || null,
      preferredItem: preferMatch ? preferMatch[1].trim() : null,
      quantity: 1,
      language: lang,
      raw: original,
    };
  }

  const removeMatch = matchPhrase(text, REMOVE_PHRASES);
  if (removeMatch) {
    const { quantity, unit, rest } = extractQuantity(text);
    const item = cleanItemName(rest, removeMatch);
    return { intent: "remove", item: item || null, quantity, unit, language: lang, raw: original };
  }

  const priceFilter = extractPriceFilter(text);
  const hasPriceFilter = priceFilter.maxPrice != null || priceFilter.minPrice != null;

  const searchMatch = matchPhrase(text, SEARCH_PHRASES);
  if (searchMatch || hasPriceFilter) {
    const item = cleanItemName(text, searchMatch);
    return {
      intent: "search",
      item: item || null,
      filters: priceFilter,
      quantity: 1,
      language: lang,
      raw: original,
    };
  }

  const addMatch = matchPhrase(text, ADD_PHRASES);
  const { quantity, unit, rest } = extractQuantity(text);
  const item = cleanItemName(rest, addMatch);

  // Default: unmatched phrasing is treated as an add-intent — most natural
  // shopping-list utterances imply "add this".
  return {
    intent: "add",
    item: item || null,
    quantity,
    unit,
    language: lang,
    raw: original,
  };
}
