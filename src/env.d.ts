/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare global {
  interface Window {
    /** GSAP core, assigned once on the landing page so later inline scripts can reuse it. */
    gsap?: typeof import('gsap').gsap;
    /** GSAP ScrollTrigger plugin, registered alongside `gsap` on the landing page. */
    ScrollTrigger?: typeof import('gsap/ScrollTrigger').ScrollTrigger;
    /** Debug/test hook exposing the landing page's "tree of surahs" light data. */
    __treeLights?: unknown[];
    /** Google Tag Manager / gtag.js data layer, pushed to by analytics snippets. */
    dataLayer?: unknown[];
  }
}

export {};
