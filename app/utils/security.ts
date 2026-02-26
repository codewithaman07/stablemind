import DOMPurify from 'dompurify';

export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') {
    // SSR: Strip all tags to be safe and avoid hydration mismatches
    return html.replace(/<[^>]*>?/gm, '');
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'p', 'div', 'span', 'ul', 'ol', 'li', 'br', 'a',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['class', 'href', 'target', 'rel'],
  });
}
