export default function ListTotal({ total, pricedCount, totalCount }) {
  if (totalCount === 0 || pricedCount === 0) return null;

  return (
    <div className="list-total">
      <span>Estimated total</span>
      <span className="list-total__amount">
        ${total.toFixed(2)}
        {pricedCount < totalCount && (
          <span className="list-total__note"> ({pricedCount}/{totalCount} items priced)</span>
        )}
      </span>
    </div>
  );
}
