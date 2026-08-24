import { SearchIcon, CloseIcon } from "./icons";

export default function SearchResults({ results, query, onAdd, onClose }) {
  if (!query) return null;

  return (
    <div className="search-results">
      <div className="search-results__header">
        <h3>
          <SearchIcon /> Results for “{query}”
        </h3>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close search results">
          <CloseIcon />
        </button>
      </div>
      {results.length === 0 ? (
        <p className="empty-state__hint">No matching products found.</p>
      ) : (
        <ul>
          {results.map((product) => (
            <li key={product.id} className="search-result">
              <div>
                <span className="search-result__name">
                  {product.name} <span className="search-result__brand">({product.brand})</span>
                </span>
                <span className="search-result__meta">
                  {product.size} · ${product.price.toFixed(2)}
                  {product.organic ? " · organic" : ""}
                </span>
              </div>
              <button type="button" onClick={() => onAdd(product.name)}>
                Add
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
