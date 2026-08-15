export function getCartTotals(items) {
  return items.reduce(
    (totals, item) => ({
      quantity: totals.quantity + item.quantity,
      subtotal: totals.subtotal + item.price * item.quantity,
    }),
    { quantity: 0, subtotal: 0 },
  );
}

export function canAddProduct(item) {
  return (
    item.stock === null ||
    item.stock === undefined ||
    item.quantity < item.stock
  );
}
