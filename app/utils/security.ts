/**
 * Security utilities for StableMind.
 */

/**
 * Sanitizes an HTML string by allowing only a safe subset of tags and attributes.
 * This is used to prevent Cross-Site Scripting (XSS) when rendering LLM output
 * or other external content using dangerouslySetInnerHTML.
 *
 * @param html The raw HTML string to sanitize
 * @returns A sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  // If no HTML provided, return empty string
  if (!html) return '';

  // Fallback for Server-Side Rendering (SSR)
  // Since DOMParser is only available in the browser, we provide a basic
  // fallback for SSR to avoid hydration mismatches while maintaining basic safety.
  if (typeof window === 'undefined') {
    // During SSR, we strip all tags for maximum safety.
    // The client-side hydration will then render the properly sanitized HTML.
    return html.replace(/<[^>]*>?/gm, '');
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Whitelist of allowed tags
    const ALLOWED_TAGS = new Set([
      'B', 'I', 'BR', 'P', 'UL', 'LI', 'OL', 'STRONG', 'EM',
      'DIV', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
      'BLOCKQUOTE', 'CODE', 'PRE', 'A'
    ]);

    // Whitelist of allowed attributes per tag
    const ALLOWED_ATTRS: Record<string, Set<string>> = {
      'A': new Set(['HREF', 'TARGET', 'REL']),
      '*': new Set(['CLASS']) // Class is allowed on all tags for styling
    };

    const sanitize = (node: Node) => {
      const children = Array.from(node.childNodes);

      for (const child of children) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const el = child as HTMLElement;
          const tagName = el.tagName.toUpperCase();

          if (!ALLOWED_TAGS.has(tagName)) {
            // Replace disallowed tag with its text content
            const textNode = document.createTextNode(el.textContent || '');
            el.parentNode?.replaceChild(textNode, el);
          } else {
            // Clean attributes
            const attrs = Array.from(el.attributes);
            for (const attr of attrs) {
              const attrName = attr.name.toUpperCase();
              const isAllowed = ALLOWED_ATTRS['*'].has(attrName) ||
                               (ALLOWED_ATTRS[tagName] && ALLOWED_ATTRS[tagName].has(attrName));

              if (!isAllowed) {
                el.removeAttribute(attr.name);
                continue;
              }

              // Specific validation for href to prevent javascript: XSS
              if (tagName === 'A' && attrName === 'HREF') {
                const value = attr.value.trim().toLowerCase();
                if (value.startsWith('javascript:') || value.startsWith('data:') || value.startsWith('vbscript:')) {
                  el.removeAttribute(attr.name);
                }
              }

              // Force secure attributes for external links
              if (tagName === 'A' && el.getAttribute('target') === '_blank') {
                el.setAttribute('rel', 'noopener noreferrer');
              }
            }

            // Recurse into children
            sanitize(el);
          }
        } else if (child.nodeType !== Node.TEXT_NODE && child.nodeType !== Node.ELEMENT_NODE) {
          // Remove comments and other dangerous node types
          child.parentNode?.removeChild(child);
        }
      }
    };

    // Start sanitization from the body
    sanitize(doc.body);

    return doc.body.innerHTML;
  } catch (e) {
    console.error('HTML sanitization failed:', e);
    // On failure, return the plain text content for safety
    return html.replace(/<[^>]*>?/gm, '');
  }
}
