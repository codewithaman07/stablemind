import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  // Use isomorphic-dompurify for consistent sanitization on both server and client.
  // This avoids hydration mismatches and ensures server-rendered content is safe without relying on weak regex.
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'p', 'div', 'span', 'ul', 'ol', 'li', 'br', 'a',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['class', 'href', 'target', 'rel'],
  });
}
