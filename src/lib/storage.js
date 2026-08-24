// Thin localStorage persistence wrapper — keeps the app runnable with zero
// external setup or secrets. Swap in a real backend later by reimplementing
// these functions.
const LIST_KEY = "vsa_shopping_list";
const HISTORY_KEY = "vsa_add_history";

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function loadList() {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(LIST_KEY), []);
}

export function saveList(list) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LIST_KEY, JSON.stringify(list));
}

export function loadHistory() {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(HISTORY_KEY), []);
}

export function saveHistory(history) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}
