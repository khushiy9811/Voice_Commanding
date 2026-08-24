// Static dictionary mapping known item names to a category.
// Lookup is done on the normalized (lowercased, singularized) item name.
export const CATEGORY_MAP = {
  // Dairy
  milk: "Dairy",
  cheese: "Dairy",
  yogurt: "Dairy",
  butter: "Dairy",
  cream: "Dairy",
  "almond milk": "Dairy",
  "oat milk": "Dairy",
  "soy milk": "Dairy",
  paneer: "Dairy",
  curd: "Dairy",
  ghee: "Dairy",
  egg: "Dairy",

  // Produce
  apple: "Produce",
  banana: "Produce",
  orange: "Produce",
  grape: "Produce",
  mango: "Produce",
  tomato: "Produce",
  potato: "Produce",
  onion: "Produce",
  carrot: "Produce",
  spinach: "Produce",
  lettuce: "Produce",
  cucumber: "Produce",
  garlic: "Produce",
  ginger: "Produce",
  lemon: "Produce",
  strawberry: "Produce",
  watermelon: "Produce",
  broccoli: "Produce",
  capsicum: "Produce",
  "bell pepper": "Produce",

  // Bakery
  bread: "Bakery",
  bagel: "Bakery",
  croissant: "Bakery",
  bun: "Bakery",
  cake: "Bakery",
  cookie: "Bakery",

  // Snacks
  chips: "Snacks",
  chocolate: "Snacks",
  popcorn: "Snacks",
  biscuit: "Snacks",
  nuts: "Snacks",
  almond: "Snacks",
  cashew: "Snacks",

  // Beverages
  water: "Beverages",
  juice: "Beverages",
  soda: "Beverages",
  coffee: "Beverages",
  tea: "Beverages",

  // Household
  detergent: "Household",
  soap: "Household",
  shampoo: "Household",
  toothpaste: "Household",
  tissue: "Household",
  "toilet paper": "Household",
  "trash bag": "Household",

  // Meat & Seafood
  chicken: "Meat & Seafood",
  fish: "Meat & Seafood",
  mutton: "Meat & Seafood",
  shrimp: "Meat & Seafood",
  beef: "Meat & Seafood",

  // Grains & Staples
  rice: "Grains & Staples",
  flour: "Grains & Staples",
  sugar: "Grains & Staples",
  salt: "Grains & Staples",
  oil: "Grains & Staples",
  pasta: "Grains & Staples",
  lentils: "Grains & Staples",
  cereal: "Grains & Staples",
};

export const FALLBACK_CATEGORY = "Uncategorized";
