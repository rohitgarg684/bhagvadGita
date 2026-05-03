/**
 * Wraps client navigation in the View Transitions API when available (Chrome, Edge, etc.)
 * for smoother route changes on taps (chips, cards, sidebar links).
 */
export function navigateWithViewTransition(navigate: () => void): void {
  const doc = typeof document !== "undefined" ? document : null;
  const vt =
    doc && "startViewTransition" in doc
      ? (doc as Document & { startViewTransition?: (cb: () => void) => unknown }).startViewTransition
      : undefined;
  if (typeof vt === "function") {
    vt.call(doc, navigate);
  } else {
    navigate();
  }
}
