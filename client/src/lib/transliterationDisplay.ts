/**
 * Removes trailing verse labels from IAST lines (e.g. ॥12.1॥) while keeping
 * the ॥ that precedes the verse number per editorial convention.
 */
export function stripTransliterationVerseSuffix(line: string): string {
  let s = line.trimEnd();
  s = s.replace(/\d+\.\d+॥\s*$/, "");
  s = s.replace(/\s+\d+\.\d+\s*॥\s*$/, "");
  return s;
}
