// Small mock product catalog for voice search / price-filter demos.
// Collected as representative public-style sample data (name, brand, size, price in USD).
export const MOCK_CATALOG = [
  { id: 1, name: "apple", brand: "Organic Valley", size: "1 lb", price: 2.49, organic: true },
  { id: 2, name: "apple", brand: "Fresh Farms", size: "1 lb", price: 1.79, organic: false },
  { id: 3, name: "milk", brand: "Horizon", size: "1 gal", price: 4.29, organic: true },
  { id: 4, name: "milk", brand: "Great Value", size: "1 gal", price: 2.99, organic: false },
  { id: 5, name: "almond milk", brand: "Silk", size: "64 oz", price: 3.99, organic: false },
  { id: 6, name: "bread", brand: "Dave's Killer Bread", size: "24 oz", price: 5.49, organic: true },
  { id: 7, name: "bread", brand: "Wonder", size: "20 oz", price: 2.99, organic: false },
  { id: 8, name: "toothpaste", brand: "Colgate", size: "6 oz", price: 3.49, organic: false },
  { id: 9, name: "toothpaste", brand: "Tom's of Maine", size: "4 oz", price: 4.99, organic: true },
  { id: 10, name: "banana", brand: "Chiquita", size: "1 lb", price: 0.59, organic: false },
  { id: 11, name: "banana", brand: "Organic Valley", size: "1 lb", price: 0.99, organic: true },
  { id: 12, name: "chicken", brand: "Perdue", size: "1 lb", price: 3.99, organic: false },
  { id: 13, name: "chicken", brand: "Organic Prairie", size: "1 lb", price: 7.99, organic: true },
  { id: 14, name: "rice", brand: "Uncle Ben's", size: "5 lb", price: 6.49, organic: false },
  { id: 15, name: "rice", brand: "Lundberg", size: "5 lb", price: 9.99, organic: true },
  { id: 16, name: "coffee", brand: "Folgers", size: "12 oz", price: 6.99, organic: false },
  { id: 17, name: "coffee", brand: "Starbucks", size: "12 oz", price: 9.99, organic: false },
  { id: 18, name: "chips", brand: "Lay's", size: "8 oz", price: 3.29, organic: false },
  { id: 19, name: "chocolate", brand: "Ghirardelli", size: "3.5 oz", price: 3.99, organic: false },
  { id: 20, name: "water", brand: "Dasani", size: "24 pack", price: 5.99, organic: false },
  { id: 21, name: "orange", brand: "Sunkist", size: "1 lb", price: 1.49, organic: false },
  { id: 22, name: "tomato", brand: "Fresh Farms", size: "1 lb", price: 1.99, organic: false },
  { id: 23, name: "cheese", brand: "Kraft", size: "8 oz", price: 3.49, organic: false },
  { id: 24, name: "yogurt", brand: "Chobani", size: "32 oz", price: 4.49, organic: false },
  { id: 25, name: "detergent", brand: "Tide", size: "100 oz", price: 11.99, organic: false },
];

export function searchCatalog({ query, maxPrice, minPrice, organicOnly }) {
  const q = (query || "").toLowerCase().trim();
  return MOCK_CATALOG.filter((product) => {
    if (q && !product.name.toLowerCase().includes(q) && !product.brand.toLowerCase().includes(q)) {
      return false;
    }
    if (typeof maxPrice === "number" && product.price > maxPrice) return false;
    if (typeof minPrice === "number" && product.price < minPrice) return false;
    if (organicOnly && !product.organic) return false;
    return true;
  });
}
