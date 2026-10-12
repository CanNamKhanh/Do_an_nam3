const base = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, "aria-hidden": true };

export const Pin = () => (
  <svg viewBox="0 0 24 24" width={12} height={12} {...base}><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);
export const Maximize2 = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} {...base}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
);
