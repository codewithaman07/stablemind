import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') {
    // SSR: Strip all tags to be safe and avoid hydration mismatches
    return html.replace(/<[^>]*>?/gm, '');
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_ATTR: ['class', 'href', 'target', 'rel'],
  });
}
