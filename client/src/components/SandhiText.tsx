import { Fragment } from "react";

/**
 * Renders Sanskrit/IAST text where parenthesized letters (sandhi markers)
 * are displayed in a muted color. Example: "एवं(म्)" renders "एवं" normally and "(म्)" muted.
 */
export function SandhiText({ text, className, sandhiClass }: {
  text: string;
  className?: string;
  sandhiClass?: string;
}) {
  const parts = text.split(/(\([^)]+\))/g);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.startsWith("(") && part.endsWith(")") ? (
          <span key={i} className={sandhiClass || "text-gray-400"}>{part}</span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </span>
  );
}

