import { SparkleIcon, ClockIcon, LeafIcon } from "./icons";

const TYPE_ICON = {
  frequent: ClockIcon,
  seasonal: LeafIcon,
};

export default function SuggestionCard({ suggestions, onAdd, isLoading }) {
  if (isLoading) {
    return (
      <div className="suggestions">
        <h3>
          <SparkleIcon /> Suggestions
        </h3>
        <p className="suggestions__loading">
          <span className="spinner" aria-hidden="true" /> Finding suggestions…
        </p>
      </div>
    );
  }

  if (!suggestions.length) return null;

  return (
    <div className="suggestions">
      <h3>
        <SparkleIcon /> Suggestions
      </h3>
      <ul className="suggestions__list">
        {suggestions.map((s) => {
          const Icon = TYPE_ICON[s.type] || SparkleIcon;
          return (
            <li key={`${s.type}-${s.name}`} className="suggestion-chip">
              <span className="suggestion-chip__icon">
                <Icon />
              </span>
              <div className="suggestion-chip__body">
                <span className="suggestion-chip__name">{s.name}</span>
                <span className="suggestion-chip__reason">{s.reason}</span>
              </div>
              <button type="button" onClick={() => onAdd(s.name)}>
                Add
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
