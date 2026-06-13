import katex from 'katex';
import { useMemo } from 'react';

/** Render a single KaTeX expression. */
export function Tex({ tex, block = false }: { tex: string; block?: boolean }) {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        throwOnError: false,
        displayMode: block,
      }),
    [tex, block],
  );
  return (
    <span
      className={block ? 'block overflow-x-auto py-1' : 'inline'}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Render an HTML string that may contain inline math written either as
 * `$...$` or as `<span class="tex">...</span>`. Math is converted to KaTeX
 * markup; surrounding HTML is preserved.
 */
export function RichText({ html, className }: { html: string; className?: string }) {
  const out = useMemo(() => renderInlineMath(html), [html]);
  return (
    <div
      className={className}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: out }}
    />
  );
}

export function renderInlineMath(input: string): string {
  let s = input;
  // <span class="tex">EXPR</span>
  s = s.replace(/<span class="tex">([\s\S]*?)<\/span>/g, (_m, expr) =>
    katex.renderToString(expr, { throwOnError: false, displayMode: false }),
  );
  // $EXPR$  (avoid matching empty)
  s = s.replace(/\$([^$]+)\$/g, (_m, expr) =>
    katex.renderToString(expr, { throwOnError: false, displayMode: false }),
  );
  return s;
}
