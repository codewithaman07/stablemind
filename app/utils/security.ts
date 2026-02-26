import type DOMPurifyType from 'dompurify';

let DOMPurify: DOMPurifyType | null = null;

function getDOMPurify(): DOMPurifyType {
  if (!DOMPurify) {
    // Lazy-load DOMPurify only in environments where it's actually used.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dompurifyModule = require('dompurify');
    DOMPurify = (dompurifyModule.default || dompurifyModule) as DOMPurifyType;
  }
  return DOMPurify;
}

export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') {
    // SSR: Strip all tags to be safe and avoid hydration mismatches
    return html.replace(/<[^>]*>?/gm, '');
  }

  const domPurifyInstance = getDOMPurify();

  return domPurifyInstance.sanitize(html, {
    ],
    ALLOWED_ATTR: ['class', 'href', 'target', 'rel'],
  });
}
