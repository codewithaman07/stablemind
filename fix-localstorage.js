/**
 * Patches Node.js 22+'s broken localStorage polyfill.
 * Node 22+ exposes a global `localStorage` object but without
 * getItem/setItem/removeItem when --localstorage-file isn't configured.
 * This causes @clerk/shared to crash during SSR.
 * 
 * This script runs before anything else via --require.
 */
if (typeof globalThis.localStorage !== 'undefined' && typeof globalThis.localStorage.getItem !== 'function') {
    delete globalThis.localStorage;
}
