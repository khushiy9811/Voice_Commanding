// Static substitutes map used when an item is unavailable or the user
// states a preference (e.g., "prefer almond milk instead of milk").
export const SUBSTITUTES_MAP = {
  milk: ["almond milk", "oat milk", "soy milk"],
  butter: ["margarine", "ghee"],
  sugar: ["honey", "jaggery", "stevia"],
  rice: ["quinoa", "cauliflower rice"],
  bread: ["multigrain bread", "gluten-free bread"],
  chicken: ["tofu", "paneer", "mushroom"],
  beef: ["mutton", "plant-based mince"],
  pasta: ["zucchini noodles", "rice noodles"],
  flour: ["almond flour", "whole wheat flour"],
  cream: ["coconut cream", "cashew cream"],
  yogurt: ["coconut yogurt", "soy yogurt"],
  soda: ["sparkling water", "kombucha"],
  coffee: ["decaf coffee", "chicory coffee"],
};

export function getSubstitutes(itemName) {
  return SUBSTITUTES_MAP[itemName.toLowerCase()] || [];
}
