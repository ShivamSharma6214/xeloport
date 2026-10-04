/** Full rupee amount with Indian digit grouping: ₹4,20,670 */
export function inr(n: number): string {
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

/** Compact rupee amount: ₹64,000 stays as is; lakh amounts become ₹4.21L */
export function inrShort(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)}Cr`;
  if (abs >= 100_000) return `₹${(n / 100_000).toFixed(2)}L`;
  return inr(n);
}

export function pct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}
