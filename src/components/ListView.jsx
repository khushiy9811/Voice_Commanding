import { PlusIcon, MinusIcon, TrashIcon, CheckIcon } from "./icons";

const CATEGORY_ACCENT = {
  Dairy: "#5b8def",
  Produce: "#4caf7d",
  Bakery: "#d99a4e",
  Snacks: "#c2694b",
  Beverages: "#4aa8c4",
  Household: "#8a7cc7",
  "Meat & Seafood": "#d15b6f",
  "Grains & Staples": "#b08a3e",
  Uncategorized: "#9aa0a8",
};

function groupByCategory(items) {
  const groups = {};
  for (const item of items) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }
  for (const list of Object.values(groups)) {
    list.sort((a, b) => Number(Boolean(a.picked)) - Number(Boolean(b.picked)));
  }
  return groups;
}

export default function ListView({ items, onUpdateQuantity, onRemove, onTogglePicked }) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>Your shopping list is empty.</p>
        <p className="empty-state__hint">Try saying “add milk” or “I need 3 apples.”</p>
      </div>
    );
  }

  const groups = groupByCategory(items);

  return (
    <div className="list-view">
      {Object.entries(groups).map(([category, categoryItems]) => (
        <section key={category} className="list-view__group">
          <h3 className="list-view__category">
            <span
              className="list-view__category-dot"
              style={{ background: CATEGORY_ACCENT[category] || CATEGORY_ACCENT.Uncategorized }}
            />
            {category}
          </h3>
          <ul className="list-view__items">
            {categoryItems.map((item) => (
              <li key={item.id} className={`list-item ${item.picked ? "list-item--picked" : ""}`}>
                <button
                  type="button"
                  className="list-item__check"
                  role="checkbox"
                  aria-checked={Boolean(item.picked)}
                  aria-label={`Mark ${item.name} as ${item.picked ? "not picked up" : "picked up"}`}
                  onClick={() => onTogglePicked(item.id)}
                >
                  {item.picked && <CheckIcon />}
                </button>
                <div className="list-item__info">
                  <span className="list-item__name">{item.name}</span>
                  {item.unit && <span className="list-item__unit">{item.unit}</span>}
                </div>
                <div className="list-item__controls">
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={`Decrease quantity of ${item.name}`}
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    <MinusIcon />
                  </button>
                  <span className="list-item__qty">{item.quantity}</span>
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={`Increase quantity of ${item.name}`}
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <PlusIcon />
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn--danger"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => onRemove(item.id)}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
