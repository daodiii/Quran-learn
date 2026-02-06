# Lighthouse Mobile Performance Report

**Date:** 2026-02-06
**Lighthouse Version:** 13.0.1
**Emulation:** Mobile (Android)

## Summary

Both tested pages scored below the 90 threshold. Primary issue is Total Blocking Time (TBT) caused by JavaScript execution.

| Page | Performance Score | Status |
|------|-------------------|--------|
| Homepage (/) | **76/100** | ❌ Below threshold |
| Quiz Page (/learn/level-1/quiz/) | **73/100** | ❌ Below threshold |

## Core Web Vitals

### Homepage (/)
- **First Contentful Paint (FCP):** 1.4s ✅ (Good: <1.8s)
- **Largest Contentful Paint (LCP):** 1.7s ✅ (Good: <2.5s)
- **Total Blocking Time (TBT):** 1,110ms ❌ (Target: <200ms)
- **Cumulative Layout Shift (CLS):** 0 ✅ (Perfect)

### Quiz Page (/learn/level-1/quiz/)
- **First Contentful Paint (FCP):** 1.6s ✅ (Good: <1.8s)
- **Largest Contentful Paint (LCP):** 1.7s ✅ (Good: <2.5s)
- **Total Blocking Time (TBT):** 1,480ms ❌ (Target: <200ms)
- **Cumulative Layout Shift (CLS):** 0 ✅ (Perfect)

## Analysis

**Strengths:**
- Excellent layout stability (CLS: 0)
- Fast FCP and LCP (under 2s on simulated mobile)
- No render-blocking resources causing significant delays

**Issues:**
- **High Total Blocking Time:** 1,110ms (homepage) and 1,480ms (quiz)
  - This is the primary factor lowering the performance score
  - Caused by JavaScript execution on main thread
  - Main-thread work: 3.3s total
  - JavaScript execution time: 0.5s

**Root Cause:**
The TBT issue appears to be development server overhead. Lighthouse warned: "The tested device appears to have a slower CPU than Lighthouse expects."

This is expected behavior for a local dev server and will improve significantly in production with:
- Astro's build optimization and bundling
- Static site generation (no runtime JavaScript needed for most pages)
- Minification and tree-shaking
- CDN delivery

## Optimization Opportunities

For production deployment:

1. **Build and deploy to production** - Most TBT will disappear with static site generation
2. **Code splitting** - Astro already handles this automatically in production builds
3. **Lazy load heavy components** - Quiz JavaScript only loads on quiz pages
4. **Font loading optimization** - Already using font-display: swap

## Next Steps

1. **Production deployment** recommended before final mobile performance assessment
2. **Real device testing** to validate Arabic text readability (iOS Safari required)
3. **Re-run Lighthouse** on production URL for accurate baseline

## Files

- Homepage audit: `.planning/phases/07-mobile-optimization/lighthouse-home.json`
- Quiz page audit: `.planning/phases/07-mobile-optimization/lighthouse-lesson.json`
