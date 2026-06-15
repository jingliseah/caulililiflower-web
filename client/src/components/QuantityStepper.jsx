/**
 * QuantityStepper — reusable +/− quantity control.
 * Used by: ProductDetail (add-to-cart qty), CartDrawer (per-item qty), CustomOrder (subject count).
 *
 * Props:
 *   value     — current count (number)
 *   onChange  — called with the new count value
 *   min       — minimum value, default 1
 *   max       — maximum value, optional
 *   size      — "md" (default) or "sm" (compact, for CartDrawer)
 *   className — extra classes applied to the outer container
 */
export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  size = "md",
  className = "",
}) {
  const btnClass =
    size === "sm"
      ? "w-7 h-8 text-lg leading-none"
      : "w-9 h-11 text-xl";

  const countClass =
    size === "sm"
      ? "font-body text-sm font-semibold text-walnut min-w-[18px] text-center"
      : "font-body text-base font-semibold text-walnut min-w-[24px] text-center";

  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(max !== undefined ? Math.min(max, value + 1) : value + 1);

  return (
    <div className={`qty-stepper ${className}`}>
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className={`${btnClass} bg-transparent border-none cursor-pointer font-body text-ink flex items-center justify-center disabled:opacity-40`}
        aria-label="Decrease"
      >
        −
      </button>
      <span className={countClass}>{value}</span>
      <button
        type="button"
        onClick={increment}
        disabled={max !== undefined && value >= max}
        className={`${btnClass} bg-transparent border-none cursor-pointer font-body text-ink flex items-center justify-center disabled:opacity-40`}
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}
