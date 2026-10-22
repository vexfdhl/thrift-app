# Implementation Plan: Minimalist Aesthetic & Heightened Interactivity

Transform ThriftIt DuvALL into a minimalist, tactile, and highly interactive secondhand discovery experience tailored to Duval County high school students.

---

## 1. Minimalist Aesthetic Refinements (Frontend Design Constitution)
* **Unboxed Metadata Discipline**: Replaced bulky, candy-colored pill sandwiches with clean, unboxed metadata strings separated by middle dots (`$ · $5–$20 · 1.8 mi away · 2 Dressing Rooms`).
* **3-Zone Header Contract**:
  - Zone 1 (Left): Minimalist `ThriftIt DuvALL` wordmark with subtle SVG hanger badge.
  - Zone 2 (Center): Single-line navigation links (`Discover`, `Directory`, `Duval Map`, `Student Reviews`, `Mission`) with subtle active pill indicators.
  - Zone 3 (Right): Compact interactive action cluster (`Compare`, `Saved`, `Surprise Me`).
* **Clean Card Surfaces**: Soft ivory/white frosted cards (`bg-white/95`, `backdrop-blur-xs`, `rounded-3xl`, `border border-[#844A26]/12`, `shadow-[0_4px_20px_-4px_rgba(132,74,38,0.06)]`) with subtle hover elevation and smooth active click transitions.

---

## 2. Interactive Features Implemented
* **Interactive Fit Finder & Aesthetic Vibe Matcher** (`src/components/InteractiveFitFinder.tsx`):
  - 6 interactive aesthetic vibes (90s & Y2K, Vintage Denim & Workwear, Prom & Homecoming, $1–$5 Bargain Steals, Open Dressing Rooms, Community Charities).
  - Tapping any vibe highlights the top 3 matching Duval stores with live road distance from the user's high school and verified dressing rooms.
  - Interactive "Fast Fashion vs Secondhand DuvALL" price battle simulator with toggleable basket garments (Jackets, Tees, Cargo Pants, Shoes), computing live money saved and gallons of water conserved.
* **Duval Campus Quick-Switcher & Travel Radius Bar** (`src/components/CampusSwitcherBar.tsx`):
  - Horizontal chip ribbon of popular Duval high schools (Riverside, Stanton, Fletcher, Atlantic Coast, Douglas Anderson, Paxon, Sandalwood, Mandarin, Raines, etc.).
  - Instant distance recalculation across all store cards with active highlight feedback.
  - Interactive radius slider (5 mi, 10 mi, 15 mi, All Duval).
* **Store Quick Peek Modal** (`src/components/QuickPeekModal.tsx`):
  - Instant preview drawer without leaving current scroll position.
  - Dynamic "Open Today" / "Closed" schedule calculated from current day and store hours.
  - Verified dressing room count and student price tier notes.
  - One-click Google Maps GPS navigation link, Save to Favorites, and Compare toggles.
* **Interactive Eco & Budget Impact Lab**:
  - Tactile range slider with preset quick-select buttons (`Single Outfit (2)`, `Semester Capsule (6)`, `School Year (12)`, `Club Haul (20)`).
  - 4 dynamic metric cards: Money Saved, Clean Water Conserved, CO₂ Prevented, and Textile Waste Diverted from Duval Landfills.

---

## 3. Verification & Quality
* **Typecheck & Linter**: Ran `tsc --noEmit` via `lint_applet` — 0 errors.
* **Build**: Ran `compile_applet` — build succeeded cleanly with Vite/Rollup.
* **Data Integrity**: All 24 Duval County high schools and 12 verified Jacksonville thrift stores remain fully functional with authentic coordinates, categories, and dressing room details.

