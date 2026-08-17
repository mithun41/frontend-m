export function calculateDiscountPercent(
  sellingPrice?: string | number | null,
  offerPrice?: string | number | null,
  finalPrice?: string | number | null
): number {
  const selling = parseFloat(String(sellingPrice || "0"));
  const offer = parseFloat(String(offerPrice || "0"));
  const final = parseFloat(String(finalPrice || "0"));

  if (!selling || isNaN(selling) || selling <= 0) return 0;

  // Case 1: When offer_price is provided as discount deduction
  if (!isNaN(offer) && offer > 0) {
    if (offer < selling) {
      // Check if price was computed as selling - offer
      if (!isNaN(final) && Math.abs(final - (selling - offer)) < 0.01) {
        return Math.round((offer / selling) * 100);
      }
      // If final equals offer, then offer is actually the discounted final price
      if (!isNaN(final) && Math.abs(final - offer) < 0.01) {
        return Math.round(((selling - offer) / selling) * 100);
      }
      // Default: offer represents discount amount
      return Math.round((offer / selling) * 100);
    }
  }

  // Case 2: When final price is lower than selling price
  if (!isNaN(final) && final > 0 && final < selling) {
    return Math.round(((selling - final) / selling) * 100);
  }

  return 0;
}
