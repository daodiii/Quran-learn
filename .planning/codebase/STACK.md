# Technology Stack

**Analysis Date:** 2026-02-05

## Languages

**Primary:**
- TypeScript - Type safety across application
- HTML/HTML with JSX syntax - Page structure via Astro components
- CSS - Global styling with CSS custom properties

**Secondary:**
- JavaScript - Client-side interactivity in Astro scripts
- MDX - Content pages and lesson definitions in `src/content/lessons/` and `src/content/surahs/`
- JSON - Quiz data and configuration

## Runtime

**Environment:**
- Node.js (specified via `.nvmrc` or project dependencies, version unspecified but supports npm modules)

**Package Manager:**
- npm 10.8.2+ (from package-lock.json)
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Astro 5.17.1 - Full-stack web framework for static site generation with dynamic features
- Capacitor 8.0.2 - Native mobile wrapper (iOS/Android)

**Styling:**
- Tailwind CSS 4.1.18 - Utility-first CSS framework
- @tailwindcss/vite 4.1.18 - Tailwind integration with Vite bundler

**Content:**
- @astrojs/mdx 4.3.13 - MDX support for dynamic content pages

## Key Dependencies

**Critical:**
- @supabase/supabase-js 2.94.0 - Database, authentication, and real-time data syncing
  - Handles user authentication (email/password, Google OAuth)
  - Manages user progress (lessons, quiz scores) in database tables

**Mobile/Native:**
- @capacitor/core 8.0.2 - Core bridge for native platform access
- @capacitor/android 8.0.2 - Android platform support
- @capacitor/ios 8.0.2 - iOS platform support
- @capacitor/keyboard 8.0.0 - Keyboard event handling on mobile
- @capacitor/splash-screen 8.0.0 - Splash screen management
- @capacitor/status-bar 8.0.0 - Status bar styling

**Development Only:**
- @capacitor/assets 3.0.5 - Asset generation for mobile icons/splashes

## Configuration

**Environment:**
- `.env` and `.env.example` files contain Supabase configuration
- Required variables:
  - `PUBLIC_SUPABASE_URL` - Supabase project URL
  - `PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous/public key
- Variables prefixed with `PUBLIC_` are exposed to browser (public keys only)

**Build:**
- `astro.config.mjs` - Astro configuration with Tailwind Vite plugin and MDX integration
- `tsconfig.json` - TypeScript configuration extending `astro/tsconfigs/strict`
- `capacitor.config.ts` - Capacitor mobile configuration with app metadata and plugin settings

**Tailwind:**
- Integrated via Vite plugin (`@tailwindcss/vite`)
- Custom CSS variables defined in `src/styles/global.css` for design system colors
- Dark mode support via `[data-theme="dark"]` selector

## Platform Requirements

**Development:**
- Node.js
- npm package manager
- Modern code editor (VS Code setup in `.vscode/`)

**Production:**
- Static web hosting (Astro builds to `dist/` folder)
- Supabase backend for auth and database
- iOS 13+ (from Capacitor requirements)
- Android 7+ (from Capacitor requirements)

## Build & Dev Tools

**Build System:**
- Astro build pipeline - compiles `.astro` files, MDX content, and static assets
- Vite - Underlying bundler for fast development and optimized production builds

**Development:**
- `npm run dev` - Start dev server at `localhost:4321`
- `npm run build` - Production build to `dist/`
- `npm run preview` - Local preview of production build
- `npm run astro` - Direct Astro CLI access

**Mobile Commands:**
- `npm run cap:sync` - Sync web assets to native projects
- `npm run cap:open:ios` - Open iOS project in Xcode
- `npm run cap:open:android` - Open Android project in Android Studio
- `npm run build:ios` - Build web and sync to iOS
- `npm run build:android` - Build web and sync to Android
- `npm run build:mobile` - Build web and sync both platforms

---

*Stack analysis: 2026-02-05*
