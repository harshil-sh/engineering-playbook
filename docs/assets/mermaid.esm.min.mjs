// Local MkDocs Mermaid loader.
// Keeps strict builds deterministic by avoiding a build-time network check while
// loading the Mermaid runtime from the public CDN in the browser.
export { default } from 'https://unpkg.com/mermaid@10.4.0/dist/mermaid.esm.min.mjs';
