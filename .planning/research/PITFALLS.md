# Pitfalls Research

**Domain:** Educational UI Redesign with Arabic/RTL Content
**Researched:** 2026-02-05
**Confidence:** HIGH (Arabic/RTL), MEDIUM (Educational patterns), MEDIUM (Coursera-like patterns)

## Critical Pitfalls

### Pitfall 1: Font File Corruption During Redesign

**What goes wrong:**
Custom Arabic fonts (UthmanicHafs, Amiri) that are critical to the project get accidentally overwritten, deleted, or their CSS references broken during UI restructuring. This is especially dangerous when moving CSS files or restructuring stylesheets for new component patterns.

**Why it happens:**
Designers/developers unfamiliar with specialized Arabic fonts don't understand why multiple font files exist (regular/bold, Arabic/Latin unicode ranges) and assume they can be simplified or replaced with Google Fonts. The Uthmanichafs font for Quranic text is irreplaceable and not available via CDN.

**How to avoid:**
- Create a protected `/public/fonts/` directory that is explicitly excluded from restructuring phases
- Document in comments that lines 201-243 in global.css are CRITICAL and IMMUTABLE
- Add pre-commit hooks that verify font files and their CSS references remain intact
- Create a font verification test that checks all font-face declarations and file paths

**Warning signs:**
- Any PR that touches `src/styles/global.css` lines 201-243
- Font files showing up in git diff as deleted
- Reports of Arabic text rendering in fallback system fonts
- Unicode rendering issues on Quranic verses

**Phase to address:**
Phase 1 (Foundation/Setup) - Establish font protection before any layout changes

---

### Pitfall 2: RTL Layout Breaking with CSS Flexbox/Grid

**What goes wrong:**
New Coursera-style card layouts and sidebar navigation fail to properly mirror in RTL mode. Elements like breadcrumbs, progress bars, and collapsible sidebars remain left-aligned or have incorrect directional flow, creating a jarring mixed-direction interface.

**Why it happens:**
Developers test only in LTR mode and assume `dir="rtl"` on the HTML element automatically handles everything. Modern CSS Grid and Flexbox don't automatically reverse all properties (border-radius, padding directional values, absolute positioning). Astro has documented limitations with RTL support.

**How to avoid:**
- Use CSS logical properties (`margin-inline-start` instead of `margin-left`, `border-start-start-radius` instead of `border-top-left-radius`)
- Test every new component in RTL mode from the start, not at the end
- Use PostCSS RTL plugin or similar preprocessor to generate RTL-specific CSS
- Avoid CSS `direction` property alone; combine with proper `dir` HTML attribute
- Browser support for logical properties like `border-radius` is incomplete; provide fallbacks

**Warning signs:**
- Icons pointing wrong direction in RTL (arrows, chevrons)
- Sidebar appearing on wrong side in RTL
- Breadcrumb separators (>) not reversing to (<)
- Progress bars filling from wrong direction
- Dropdowns opening in wrong direction

**Phase to address:**
Phase 2 (Component Foundation) - Before building any new UI components

---

### Pitfall 3: Arabic Text Word-Break on Responsive Cards

**What goes wrong:**
Card layouts with `word-break: break-word` or `word-break: break-all` destroy Arabic text readability by breaking connected letters mid-word. Arabic letters are connected, so breaking them creates nonsensical character fragments. As documented in RTL design best practices, "there is no such thing as word breaks in Arabic—the letters of a word are connected with each other, so it's not possible to break a word."

**Why it happens:**
Responsive card designs need to handle long English words that overflow containers. Developers apply `word-break` globally without realizing it has catastrophic effects on Arabic script.

**How to avoid:**
- Use `overflow-wrap: break-word` instead of `word-break` for general overflow handling
- Apply `word-break` only to specific language contexts using `[lang="en"]` selectors
- Use CSS `hyphens: auto` with proper `lang` attributes for English content
- Test all card layouts with actual Arabic lesson titles (not Lorem Ipsum)
- Use `dir="auto"` on mixed-content elements to let the browser detect language direction

**Warning signs:**
- Arabic words appearing as disconnected letter fragments
- Complaints about lesson titles being unreadable on mobile
- Text overflowing containers only in Arabic content
- Accessibility tools announcing Arabic text as random letter sequences

**Phase to address:**
Phase 3 (Card Layout Implementation) - When implementing Coursera-like card grids

---

### Pitfall 4: Dark Mode Contrast Failure with Arabic Typography

**What goes wrong:**
Arabic fonts at typical web weights (400, 700) lose readability in dark mode due to insufficient contrast. The intricate letterforms and diacritics of Arabic script require higher contrast ratios than Latin text to maintain legibility. As noted in dark mode typography best practices, "in dark mode, typography tends to follow the pattern of fonts getting a little bit heavier, more space between the lines, and text colors being moderate."

**Why it happens:**
Dark mode color palettes designed for Latin text don't account for Arabic typography complexity. Font weight adjustments that work for Roboto or Inter fail for Amiri. Developers test dark mode with English content and assume it's fine.

**How to avoid:**
- Increase font weight for Arabic text in dark mode (use 500 instead of 400, 800 instead of 700)
- Ensure minimum 7:1 contrast ratio for Arabic body text (higher than WCAG AA's 4.5:1)
- Increase line-height by 0.1-0.2em in dark mode for Arabic text
- Test dark mode with actual Quranic text using Uthmanichafs font
- Use `prefers-color-scheme` media query to adjust Arabic font rendering
- Prefer clean sans-serif fonts like Inter, Roboto, or Noto Sans for UI (not content) in dark mode

**Warning signs:**
- Arabic diacritical marks disappearing in dark mode
- User complaints about eye strain when reading lessons in dark mode
- Accessibility tools reporting contrast failures only in dark mode
- Arabic text appearing "washed out" or "fuzzy"

**Phase to address:**
Phase 4 (Dark Mode Refinement) - After basic dark mode implementation

---

### Pitfall 5: Progress Tracking State Loss During Navigation

**What goes wrong:**
Coursera-style progress bars and completion states reset or become inconsistent when users navigate between lessons. The new sidebar structure causes localStorage keys to be overwritten or browser back button clears completion data.

**Why it happens:**
Frontend-only progress tracking uses simple localStorage without proper state management. Navigation events don't properly preserve/restore state. MDX lesson content is regenerated on each route change without hydrating progress state.

**How to avoid:**
- Implement centralized state management for progress tracking (Zustand, Nanostores)
- Use unique, stable identifiers for each lesson (not index-based)
- Persist progress to localStorage on every state change, not just on navigation
- Test browser back/forward buttons don't reset progress
- Add visual feedback when progress is saved/synced
- Consider session storage for temporary state, localStorage for persistent
- Handle localStorage quota exceeded errors gracefully with try-catch

**Warning signs:**
- Progress bars showing completed lessons as incomplete after refresh
- Users reporting lost progress after browser restart
- Progress not syncing across multiple tabs
- Completion checkmarks disappearing on navigation

**Phase to address:**
Phase 5 (Progress System Implementation) - When adding progress tracking features

---

### Pitfall 6: Mobile Font Size Too Small for Arabic on iOS

**What goes wrong:**
Arabic text at web-standard font sizes (16px) becomes unreadable on iOS devices due to the intricate nature of Arabic letterforms and diacritics. iOS WebKit (used by Safari and Capacitor apps) renders Arabic fonts differently than Android, making them appear smaller than equivalent Latin text. Default browser settings often render Arabic script too small or unreadable.

**Why it happens:**
Responsive typography scales are designed for Latin fonts. iOS WebKit rendering differs from Android. The `-webkit-text-size-adjust` property interferes with Arabic text scaling. The horizontal pixel grid of digital displays struggles to render the flowing curves and diagonal strokes characteristic of Arabic script.

**How to avoid:**
- Set minimum 18px base font size for Arabic body text on mobile
- Use `font-size: max(16px, 1rem)` to prevent scaling below readable size
- Disable `-webkit-text-size-adjust: 100%` for Arabic content
- Test on actual iOS devices, not just simulators (rendering differs)
- For Capacitor apps, test in WKWebView specifically
- Increase font size for Quranic text (Uthmanichafs) to minimum 20px on mobile

**Warning signs:**
- User reports about text being too small specifically on iPhones/iPads
- Arabic text appearing smaller than English UI text at same font-size
- Pinch-to-zoom being required to read lesson content
- Accessibility complaints about mobile readability

**Phase to address:**
Phase 6 (Mobile Optimization) - During responsive/mobile testing phase

---

### Pitfall 7: Breadcrumb Navigation Breaking Lesson Hierarchy

**What goes wrong:**
Adding Coursera-style breadcrumbs to the existing 61 MDX lessons creates incorrect hierarchical paths that don't match the actual lesson structure. Users get lost because breadcrumbs show a different path than the sidebar navigation. Common mistakes include making the last breadcrumb a clickable link (it's the current page) or using unclear labels.

**Why it happens:**
MDX lessons don't have explicit parent-child relationships defined. Developers infer hierarchy from folder structure or frontmatter, leading to mismatches. Breadcrumb logic doesn't account for lessons that appear in multiple categories or learning paths.

**How to avoid:**
- Audit all 61 lessons and document actual hierarchical relationships
- Add explicit hierarchy metadata to MDX frontmatter (parent, siblings, category)
- Ensure breadcrumbs exactly match sidebar navigation structure
- Test breadcrumbs with lessons at different hierarchy depths
- Provide fallback behavior for lessons without clear hierarchy
- Make breadcrumbs RTL-aware (reverse order and separators)
- Don't make the last breadcrumb item clickable (it's the current page)
- Follow EdX pattern of contrasting breadcrumb font with background for better visibility

**Warning signs:**
- Breadcrumb "back" links going to unexpected pages
- Breadcrumbs showing different structure than sidebar
- Orphaned lessons with incomplete breadcrumb trails
- Breadcrumb separators not reversing in RTL mode
- Super long breadcrumb trail on mobile

**Phase to address:**
Phase 7 (Navigation System) - When implementing breadcrumb component

---

### Pitfall 8: Collapsible Sidebar Hiding Active Lesson Indicator

**What goes wrong:**
Coursera-style collapsible sidebar successfully collapses, but when collapsed, users lose visual indication of which lesson they're currently viewing. The collapsed state shows only icons or short labels without highlighting the active lesson. This is a progressive disclosure problem—hiding too much critical information.

**Why it happens:**
Designers focus on making the sidebar collapsible without considering the collapsed state UX. Active lesson highlighting is implemented only for the expanded state. Mobile breakpoints force sidebar collapse without alternative active lesson indicators.

**How to avoid:**
- Add active lesson indicator to both expanded and collapsed states
- Use color coding, not just text, to show current lesson (works when collapsed)
- Provide breadcrumbs as fallback active lesson indicator when sidebar is collapsed
- Test on mobile widths where sidebar is always collapsed
- Use progressive disclosure pattern: collapsed sidebar shows category, expanding shows lessons
- Ensure RTL mode has proper active indicators
- Remember user preference for collapsed/expanded state in localStorage

**Warning signs:**
- Users opening multiple lessons because they can't see which is active
- Confusion about current location when sidebar is collapsed
- Accessibility tools not announcing current lesson when sidebar is collapsed
- No keyboard navigation indication in collapsed state

**Phase to address:**
Phase 8 (Sidebar Implementation) - During collapsible sidebar development

---

### Pitfall 9: Capacitor/Mobile App Font Loading Performance

**What goes wrong:**
Custom Arabic fonts (UthmanicHafs, Amiri) cause 2-5 second white screens or FOIT (Flash of Invisible Text) when the app launches on mobile devices. This is especially severe on iOS where WKWebView has strict memory management and can trigger "white screen of death" when using too much memory.

**Why it happens:**
Web fonts are optimized for browser caching, not mobile app bundles. Font files aren't properly bundled with Capacitor app assets. Multiple font files (regular/bold, Arabic/Latin) load sequentially instead of in parallel. `font-display: swap` causes layout shifts with Arabic text.

**How to avoid:**
- Bundle font files directly in Capacitor app assets, not served over HTTP
- Use `font-display: block` for critical Uthmanichafs font (max 3s block acceptable)
- Preload critical fonts in app shell: `<link rel="preload" as="font">`
- Subset fonts to only required unicode ranges to reduce file size
- Test on low-end Android devices (more memory constrained)
- Consider font fallback stack with system Arabic fonts during load
- Profile font loading with Chrome DevTools when testing in mobile view
- Make WKWebView more memory-conscious by adjusting caching and turning off unused features
- Optimize images and other media files to reduce loading times

**Warning signs:**
- White screen on app launch lasting >2 seconds
- Text flashing from system font to custom font
- "Out of memory" crashes on iOS after repeated lesson navigation
- Slow lesson load times specifically on mobile
- Different font rendering between web and mobile app

**Phase to address:**
Phase 9 (Performance Optimization) - Before production mobile app release

---

### Pitfall 10: Screen Reader Announcing Progress Bars Incorrectly

**What goes wrong:**
Screen readers announce Coursera-style progress bars as "progress bar 0%" or don't announce completion state changes. Users with visual impairments can't track their lesson completion progress. NVDA and JAWS (the two most popular screen readers) may behave differently from VoiceOver.

**Why it happens:**
Progress bars use visual-only CSS styling without proper ARIA labels. Progress state changes happen without screen reader announcements. RTL languages may cause screen readers to announce progress backwards. NVDA adheres strictly to the DOM and accessibility tree, making it excellent for spotting structural issues.

**How to avoid:**
- Use `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Provide `aria-label` in both English and Arabic: "Lesson 3 of 61 complete"
- Use `aria-live="polite"` region to announce progress changes
- Test with NVDA (free, most popular) in addition to VoiceOver (iOS/Mac default)
- Ensure progress announcements work correctly in RTL mode
- Don't rely only on visual indicators; provide text alternatives
- Support screen readers and high-contrast modes
- Add text like "50% complete" for clarity, especially for assistive technologies

**Warning signs:**
- Screen readers silent when progress updates
- Progress announced in wrong language
- Completion states not announced at all
- RTL mode causing reversed progress announcements
- NVDA/JAWS behaving differently than VoiceOver

**Phase to address:**
Phase 10 (Accessibility Polish) - Final accessibility audit phase

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Using CSS `direction: rtl` instead of logical properties | Faster initial implementation | Partial RTL support, browser compatibility issues, hard to maintain | Never - W3C recommends HTML `dir` attribute over CSS |
| Flipping entire layout with `transform: scaleX(-1)` | Instant visual RTL | Images/icons flip incorrectly, text rendering issues, accessibility breaks | Never - this breaks semantics |
| Google Fonts CDN for Arabic fonts | Easy setup, no file management | Font files not available offline, Uthmanichafs not on CDN, privacy concerns | Never - custom fonts required |
| Index-based lesson IDs for progress tracking | Simple to implement | Breaks if lesson order changes, doesn't support reorganization | Never - use stable slugs |
| Hardcoded breadcrumbs in each MDX file | Full control per lesson | Unmaintainable with 61 lessons, inconsistencies guaranteed | Never - generate from metadata |
| Single breakpoint for mobile vs desktop | Fast responsive implementation | Tablet/medium sizes broken, sidebar UX poor | Only for initial prototyping |
| `localStorage` only for progress (no state management) | No dependencies needed | State loss, no cross-tab sync, hard to debug, quota errors | Only for MVP/prototype |
| Testing only in Chrome/English/LTR | Faster dev cycle | RTL bugs, Firefox/Safari issues, accessibility failures | Never - test RTL from start |
| `font-display: swap` for all fonts | Prevents FOIT (invisible text) | Layout shift with Arabic text, CLS penalty | Only for non-critical UI fonts |
| Copying Coursera CSS directly | Fast design implementation | License issues, doesn't work with Astro, not RTL-compatible | Never - learn patterns, don't copy |
| Using same images for LTR and RTL | No image work needed | Images mirror incorrectly, unusual layouts | Never - create RTL-specific images when needed |
| Messy breadcrumb formatting | Quick implementation | Confuses users, looks sloppy | Never - maintain consistent formatting |

## Integration Gotchas

Common mistakes when connecting to external services or frameworks.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Astro + RTL | Assuming Astro has built-in RTL support | Manually implement RTL with logical CSS, Astro lacks native RTL (documented limitation as of 2026) |
| Capacitor + Fonts | Serving fonts over HTTP in mobile app | Bundle fonts in app assets, use local paths |
| MDX + Layout | Applying layout wrapper globally to all MDX | Allow per-lesson layout overrides via frontmatter |
| Tailwind + RTL | Using directional utilities (ml-, pl-) | Use Tailwind RTL plugin or logical utilities (ms-, ps-) |
| localStorage + Progress | Not handling quota exceeded errors | Wrap in try-catch, handle quota errors gracefully |
| Dark mode + CSS vars | Hardcoding dark mode colors in components | Use CSS custom properties defined at root level |
| iOS WKWebView + Memory | Loading all fonts simultaneously | Progressive font loading, monitor memory usage |
| Screen readers + Dynamic content | Not announcing progress changes | Use ARIA live regions for state changes |
| Responsive images + MDX | Images not responsive in markdown | Ensure embedded media uses responsive attributes |
| CSS Grid + RTL | Using `left`/`right` properties | Use `start`/`end` or logical properties |
| Punctuation + RTL | Punctuation appearing in wrong location | Use proper text isolation with `dir` attribute |
| Numbers + RTL context | Numbers breaking visual flow | Understand regional differences in numeric formatting (Western vs Eastern Arabic numerals) |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Loading all 61 lessons metadata on initial page load | Slow initial load, high memory usage | Lazy load lesson metadata, paginate sidebar | >30 lessons in memory |
| Unoptimized Arabic font files | Long FOIT, mobile crashes | Subset fonts, preload critical fonts, use WOFF2 | Mobile devices, slow 3G |
| CSS-in-JS for RTL logic | Runtime performance penalty | Use PostCSS RTL plugin, generate static CSS | Every component render |
| Progress tracking on every scroll event | Janky scrolling, high CPU | Throttle/debounce progress updates, track on section visibility | Mobile devices |
| Re-rendering entire sidebar on progress change | UI freezes when marking lesson complete | Optimize re-renders, use React.memo or similar | >20 lessons in sidebar |
| Inline styles for dynamic RTL | Large HTML payload, no caching | CSS classes with logical properties | Every page load |
| Full-page re-render on theme toggle | Flash/flicker when switching themes | Use CSS custom properties, minimize JS | Any theme toggle |
| localStorage reads on every component render | Performance degradation | Cache in memory, read once on mount | Frequent renders |
| High presence of unoptimized images | Lower performance scores, increased load time | Optimize image size, use appropriate compression | Mobile, slow connections |
| Too much info displayed at once | User overload, cognitive burden | Structure information hierarchically, progressive disclosure | Educational content specifically |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Storing progress data without user IDs | Progress data mixup between users | Include user/session ID in localStorage keys |
| Allowing user-generated Arabic content in lesson titles | XSS via Unicode exploits | Sanitize all user input, use DOMPurify |
| Loading fonts from untrusted CDNs | Privacy leaks, font replacement attacks | Self-host all fonts, use Subresource Integrity |
| Not validating lesson IDs from URL params | Access to unreleased/private lessons | Validate lesson IDs against allowed list |
| Client-side only progress validation | Progress manipulation, achievement fraud | Validate progress server-side if adding gamification |
| Exposing sensitive config in mobile app | API keys, database credentials leaked | Use environment variables, secure storage for Capacitor |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Forcing sidebar collapse on tablet widths | Constant opening/closing sidebar to navigate | Remember user preference, allow toggle at all widths |
| Progress bars without text labels | Ambiguous completion state, not accessible | Show "3 of 61 lessons complete" text, add "50% complete" for clarity |
| Same card size for all lesson types | Inconsistent content density, truncation | Variable card heights using CSS Grid 1fr, or normalize content length |
| No indication of estimated lesson time | Users can't plan learning sessions | Add time estimates to each lesson card |
| Breadcrumbs only show structure, not progress | Users don't know how far they've come | Combine breadcrumbs with progress indicator |
| Collapsible sidebar doesn't persist state | Re-collapses on every page load | Remember collapsed/expanded state in localStorage |
| Auto-scrolling sidebar to active lesson | Disorienting, loses user's place | Scroll to active lesson only on page load, not on sidebar interaction |
| No visual feedback when marking lesson complete | Users uncertain if action registered | Show checkmark animation, haptic feedback on mobile |
| Loading states in English only | Arabic users see jarring language switch | Provide loading states in current language |
| Keyboard navigation doesn't follow RTL | Tab order goes left-to-right in RTL mode | Ensure tab order matches visual order in RTL |
| Throwing too much info at readers | User overload, decreased engagement | Progressive disclosure, structured navigation |
| Poor content localization | Feels machine-translated, not native | Human translation for all UI text, not literal translations |
| Mobile optimization neglect | Missing 70%+ of MENA users | Mobile-first approach, test on actual devices |
| Inconsistent fonts and image usage | Unprofessional appearance, usability issues | Standardize fonts, culturally appropriate images |
| Dismissing user feedback | Decreased engagement, platform abandonment | Act on feedback meaningfully, address root causes |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Progress bars:** Often missing ARIA labels and live region announcements — verify with screen reader
- [ ] **RTL layout:** Often tested only in Chrome LTR — verify in Firefox/Safari with `dir="rtl"`
- [ ] **Dark mode:** Often tested only with Latin text — verify Arabic text contrast meets WCAG AAA (7:1)
- [ ] **Collapsible sidebar:** Often works only on desktop — verify mobile behavior and state persistence
- [ ] **Breadcrumbs:** Often hardcoded for demo pages — verify dynamic generation for all 61 lessons
- [ ] **Card layouts:** Often use fixed heights — verify Arabic text doesn't truncate or overflow
- [ ] **Font loading:** Often tested only on fast WiFi — verify 3G mobile performance
- [ ] **Keyboard navigation:** Often tested only with mouse — verify Tab, Enter, Escape, Arrow keys
- [ ] **Progress persistence:** Often works in current tab — verify survives page refresh and new tabs
- [ ] **Mobile fonts:** Often tested only on desktop — verify iOS Safari renders Arabic fonts at readable size
- [ ] **Mixed content:** Often tested with English only — verify bidirectional text (English + Arabic) renders correctly
- [ ] **Error states:** Often missing for quota exceeded — verify localStorage full scenario
- [ ] **Image responsiveness:** Often images not responsive in MDX — verify all embedded media has proper attributes
- [ ] **Icon directionality:** Often icons don't mirror in RTL — verify arrows, chevrons reverse correctly
- [ ] **Punctuation placement:** Often punctuation in wrong position — verify with mixed LTR/RTL content
- [ ] **User feedback integration:** Often design ignores user requests — verify feedback loop exists
- [ ] **Accessibility testing:** Often tested only with VoiceOver — verify NVDA (most popular) works correctly
- [ ] **Container queries:** Often use media queries — verify components respond to container size, not viewport

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Font files deleted/broken | LOW | Restore from git, verify with test suite, redeploy |
| RTL layout partially broken | MEDIUM | Audit all CSS for directional properties, convert to logical properties, test in RTL |
| Word-break destroying Arabic text | LOW | Find all `word-break` rules, scope to `[lang="en"]`, test with Arabic content |
| Dark mode contrast failures | LOW | Increase font-weight and color contrast for dark mode, retest with accessibility tools |
| Progress tracking lost data | HIGH | No recovery for lost data - add state persistence, apologize to users |
| Mobile fonts too small | LOW | Increase base font-size for Arabic, add media queries, test on devices |
| Breadcrumbs showing wrong hierarchy | MEDIUM | Rebuild breadcrumb logic from lesson metadata, verify all 61 lessons |
| Collapsed sidebar loses active indicator | LOW | Add active state styling to collapsed mode, test on mobile |
| Font loading performance issues | MEDIUM | Profile loading, subset fonts, implement preloading, test on 3G |
| Screen reader announcements broken | MEDIUM | Add ARIA labels and live regions, test with NVDA/JAWS/VoiceOver |
| User workflow disrupted by redesign | HIGH | User research to understand impact, potentially revert changes or provide classic view |
| Astro build breaking | MEDIUM | Check for client-side code in components, review Astro 5.x static generation docs |
| Capacitor memory crashes | HIGH | Profile memory usage, reduce font loading, optimize images, test on low-end devices |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Font corruption | Phase 1 - Foundation | Font test suite passes, all 4 font families render correctly |
| RTL layout breaking | Phase 2 - Component Foundation | All components render correctly in RTL mode, logical properties used |
| Arabic word-break | Phase 3 - Card Layout | Arabic lesson titles display correctly on mobile, no letter fragments |
| Dark mode contrast | Phase 4 - Dark Mode | WCAG AAA contrast for Arabic text, 7:1 ratio verified |
| Progress state loss | Phase 5 - Progress System | Progress survives page refresh, localStorage persistence tested |
| Mobile font size | Phase 6 - Mobile Optimization | iOS devices show 18px+ Arabic text, readable without zoom |
| Breadcrumb hierarchy | Phase 7 - Navigation System | All 61 lessons have correct breadcrumb paths matching sidebar |
| Collapsed sidebar UX | Phase 8 - Sidebar Implementation | Active lesson visible in both collapsed/expanded states |
| Font loading performance | Phase 9 - Performance | App launches <2s on mobile, fonts preloaded, no FOIT |
| Screen reader issues | Phase 10 - Accessibility | NVDA/VoiceOver announce all interactive elements correctly |

## Sources

**RTL/Arabic Design:**
- [RTL websites design and development - mistakes & best practices | Reffine](https://www.reffine.com/en/blog/rtl-website-design-and-development-mistakes-best-practices)
- [Arabic Website Design Basics Every Designer Should Know](https://hapy.co/journal/arabic-website-design-basics/)
- [RTL (Right to Left) Landing Page](https://landingi.com/landing-page/rtl-examples/)
- [Case Study: How To Design An Arabic Website](https://cadabra.studio/blog/arabic-website-design-case-study/)
- [Right to Left Styling 101](https://rtlstyling.com/posts/rtl-styling/)
- [Structural markup and right-to-left text in HTML - W3C](https://www.w3.org/International/questions/qa-html-dir)
- [Right-to-left development: Tips and tricks](https://globaldev.tech/blog/right-left-development-tips-and-tricks)
- [7 Pro Strategies for RTL Design: Enhancing Arabic and Hebrew Websites - ConveyThis](https://www.conveythis.com/blog/7-pro-strategies-for-rtl-design)

**Educational UI/UX:**
- [11 Common UI/UX Design Mistakes (and How to Fix Them) — A Practical Guide for Better User Experience [2026]](https://www.ideapeel.com/blogs/ui-ux-design-mistakes-how-to-fix-them)
- [13 UX Design Mistakes You Should Avoid in 2026](https://www.wearetenet.com/blog/ux-design-mistakes)
- [Best of the Best: the Top 8 eLearning Interface Design Examples](https://www.eleken.co/blog-posts/elearning-interface-design-examples)
- [E-learning platform design guide](https://www.justinmind.com/ui-design/how-to-design-e-learning-platform)

**Arabic Fonts & Performance:**
- [Results: Font, Image Usage, and Performance Trends across 73 Arabic Websites | HackerNoon](https://hackernoon.com/results-font-image-usage-and-performance-trends-across-73-arabic-websites)
- [Design Arabic Websites with Consistent Fonts, Optimal Sizes, and Culturally Aligned Images | HackerNoon](https://hackernoon.com/design-arabic-websites-with-consistent-fonts-optimal-sizes-and-culturally-aligned-images)
- [Arabic Website Design Must Bridge Usability Gaps in Fonts and Images | HackerNoon](https://hackernoon.com/arabic-website-design-must-bridge-usability-gaps-in-fonts-and-images)
- [Fonts and readability: Best Arabic Script for the web - Code Guru](https://codeguru.ae/blog/fonts-and-readability-best-arabic-script-for-the-web/)
- [10 Arabic Fonts Every UX Designer Should Know in 2025 – Ahmed Elramlawy](https://ahmedelramlawy.com/10-arabic-fonts-every-ux-designer-should-know-in-2025/)
- [How to Easily Change and Enlarge Arabic Fonts in Your Web Browser | Arabic for Nerds](https://arabic-for-nerds.com/tools/arabic-letters-too-small-in-browser/)

**CSS & Development:**
- [direction - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/direction)
- [RTLCSS](https://rtlcss.com/)
- [The CSS `gap` Property: Practical Spacing for Grid, Flexbox, and Modern Responsive UI](https://thelinuxcode.com/the-css-gap-property-practical-spacing-for-grid-flexbox-and-modern-responsive-ui/)
- [RTL rendering of LTR scripts](https://w3c.github.io/i18n-drafts/questions/qa-ltr-scripts-in-rtl.en.html)
- [CSS Direction Property: Complete Guide to LTR and RTL Text Direction - CodeLucky](https://codelucky.com/css-direction-property/)
- [Struggling With Responsive Design? Build This Simple Card Layout | Medium](https://medium.com/@sameekshadalvi7/struggling-with-responsive-design-build-this-simple-card-layout-bf9f2a7ecd40)
- [Responsive Design in 2026: What's New and What's Next | Medium](https://medium.com/@netizens_technologies/responsive-design-in-2026-whats-new-and-what-s-next-137285d4f0c6)

**Navigation & UX Patterns:**
- [Breadcrumbs In Web Design: Examples And Best Practices — Smashing Magazine](https://www.smashingmagazine.com/2009/03/breadcrumbs-in-web-design-examples-and-best-practices/)
- [Designing Effective Breadcrumbs Navigation — Smashing Magazine](https://www.smashingmagazine.com/2022/04/breadcrumbs-ux-design/)
- [5 Need to Know Breadcrumbs Best Practices | BugHerd](https://bugherd.com/blog/web-design-breadcrumbs)
- [Progressive Disclosure - NN/G](https://www.nngroup.com/articles/progressive-disclosure/)
- [Design Patterns: Progressive Disclosure for Mobile Apps | UX Planet](https://uxplanet.org/design-patterns-progressive-disclosure-for-mobile-apps-f41001a293ba)
- [Progressive disclosure in UX design: Types and use cases - LogRocket Blog](https://blog.logrocket.com/ux-design/progressive-disclosure-ux-types-use-cases/)

**Dark Mode & Typography:**
- [Typography in Dark Mode: How to Optimize Fonts for Low-Light UI | Design Shack](https://designshack.net/articles/typography/dark-mode-typography/)
- [Dark Mode Design Best Practices in 2026 | Modern UI/UX Guide](https://www.tech-rz.com/blog/dark-mode-design-best-practices-in-2026/)
- [Arabic Typography Trends 2025 - Latest Design Innovations & Font Styles](https://arabic-calligraphy-generator.com/guides/arabic-typography-trends-2025)
- [44 Beautiful Arabic Fonts That Capture Middle Eastern Elegance in 2026 - Design Work Life](https://designworklife.com/beautiful-arabic-fonts-that-capture-middle-eastern-elegance/)

**Accessibility:**
- [NVDA vs. JAWS: Screen Reader Testing Comparison | UXPin](https://www.uxpin.com/studio/blog/nvda-vs-jaws-screen-reader-testing-comparison/)
- [JAWS vs NVDA: Which Is Better for Accessibility Audits?](https://blog.equally.ai/disability-guide/jaws-vs-nvda/)
- [WebAIM: Screen Reader User Survey #10 Results](https://webaim.org/projects/screenreadersurvey10/)
- [Accessibility support for Techniques for WCAG 2.0 and WCAG 2.1](https://www.powermapper.com/tests/screen-readers/wcag/)

**Mobile/Capacitor:**
- [Improve Mobile App Performance in Capacitor Apps](https://nextnative.dev/blog/improve-mobile-app-performance)
- [How to Build Capacitor Apps A Practical Guide](https://nextnative.dev/blog/how-to-build-capacitor)
- [Build a Next.js Mobile App from Scratch with Capacitor 8](https://capgo.app/blog/nextjs-mobile-app-capacitor-from-scratch/)

**Astro Framework:**
- [Introduction to Astro and i18n](https://caisy.io/blog/astro-i18n)
- [Astro in 2026 : A Modern, Lightweight, and Relevant Framework for Today's Web | Medium](https://medium.com/@dedikusniadi/astro-in-2026-a-modern-lightweight-and-relevant-framework-for-todays-web-4facee25a4e5)
- [What's new in Astro - January 2026 | Astro](https://astro.build/blog/whats-new-january-2026/)

**Progress Tracking:**
- [Progress Trackers and Indicators – With 6 Examples To Do It Right](https://userguiding.com/blog/progress-trackers-and-indicators)
- [How to create progress indicator UI for better usability?](https://cieden.com/book/atoms/progress-indicator/progress-indicator-ui)

**MDX Content:**
- [Styling MDX Content: Theming and Layout](https://www.mdxblog.io/blog/styling-mdx-content)
- [Apache Superset Community Update: January 2026 | Preset](https://preset.io/blog/apache-superset-community-update-january-2026/)

---

*Pitfalls research for: Quran Learn Coursera-inspired UI/UX Redesign*
*Researched: 2026-02-05*
*Focus: Arabic/RTL educational content with existing MDX structure*
