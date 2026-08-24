import { MOCK_CATALOG } from "../data/mockCatalog";

// Average catalog price across brands for a given item name, or null if the
// item isn't in the mock catalog.
export function estimateItemPrice(name) {
  const normalized = name.toLowerCase().trim();
  const matches = MOCK_CATALOG.filter((p) => p.name.toLowerCase() === normalized);
  if (!matches.length) return null;
  return matches.reduce((sum, p) => sum + p.price, 0) / matches.length;
}

export function estimateListTotal(items) {
  let total = 0;
  let pricedCount = 0;
  for (const item of items) {
    const unitPrice = estimateItemPrice(item.name);
    if (unitPrice != null) {
      total += unitPrice * item.quantity;
      pricedCount += 1;
    }
  }
  return { total, pricedCount, totalCount: items.length };
}
