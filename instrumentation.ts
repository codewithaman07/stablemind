/**
 * Next.js Instrumentation Hook
 * 
 * Patches Node.js 22+'s broken localStorage polyfill.
 * Node 22+ exposes a global `localStorage` object, but without
 * getItem/setItem/removeItem when --localstorage-file isn't configured.
 * This causes @clerk/shared (and other libs) to crash during SSR.
 */
export async function register() {
    if (typeof window === 'undefined') {
        // We're on the server — check if localStorage exists but is broken
        const g = globalThis as Record<string, unknown>;
        if (g.localStorage && typeof (g.localStorage as Record<string, unknown>).getItem !== 'function') {
            // Delete the broken polyfill so libraries fall back to their own checks
            delete g.localStorage;
        }
    }
}
