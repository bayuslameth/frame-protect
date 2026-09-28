# PHASE — PREMIUM UI/UX REFINEMENT

## 1. Visual Problems Identified

The prior state of the FRAME PROTECT UI had these specific issues:

- **Landing page** felt like a generic Tailwind SaaS template: centered hero, subtitle, grid of cards, footer.
- The hero right-column was an empty placeholder with crosshair marks but no editorial composition or visual weight.
- Section titles (`h2`) used generic uppercase serif without meaningful hierarchy contrast.
- **Excessive card usage**: every content block was a `border border-border bg-surface p-6 space-y-4` card.
- Rounded corners (24–32px) on some elements conflicted with the editorial/monochrome direction.
- Button tracking and weight were inconsistent across pages.
- The `PlaceholderPage` header showed a hardcoded "Phase 5 Complete" badge — inappropriate for a final product.
- Typography was flat — all labels used the same monospace size (text-[10px]) with no meaningful scale contrast.
- Footer was 2-column; all type was the same weight and color.
- Navbar showed `Image Lab` secondary label.

---

## 2. Design Direction

**Editorial Photography × Digital Imaging Tool × Precision Instrument**

- `#F7F7F5` background — warm off-white, not clinical white
- True black (`#0A0A0A`) for primary text and structural elements
- `#D8D8D2` for borders — subtle, structural
- No gradients. No glow. No glassmorphism.
- Borders as the primary structural tool
- Typography creates hierarchy through scale contrast (serif for headings, mono for labels/metadata, sans for body)
- Images treated as photographic artifacts with thin frame lines and metadata captions

---

## 3. Major UI Improvements

### Landing Page (`app/page.tsx`)
- Replaced centered SaaS hero with **asymmetric 5-col + 7-col editorial grid**
- Left column: eyebrow label → large serif headline → body copy → CTAs → technical spec strip
- Right column: photographic frame composition with corner crop marks, image placeholder grid, contact sheet preview (3 frames), bottom metadata bar
- Added **Process section** with `01/02/03/04` numbered editorial layout using left sticky column + right 2×2 grid
- Added **Context section** with 2-column layout: long-form editorial text + signal chain diagram
- Added **Capabilities** section as a `3-col × 2-row` flush grid (not card grid)
- Added **CTA section** as bordered editorial frame with crop mark corners

### Shared Components
- **Navbar**: Logo + brand name, navigation 4 links (Protect, Attack Lab, Detect, Results), status dot. Removed `Workspace` nav item. Clean mono uppercase nav labels.
- **Footer**: 3-column grid (Brand, Algorithm, Metrics) instead of 2-col.
- **Button**: Stricter mono tracking, consistent `h-7/9/11` sizing, sharp borders.
- **Card**: Zero rounding, cleaner padding variant.
- **Badge**: Slightly smaller, tighter.
- **PlaceholderPage**: Removed "Phase 5 Complete" badge. Cleaner path label → serif title → sans description hierarchy.
- **WorkflowStepper**: More compact, cleaner connector line, `Done` tag only shows for completed.
- **ContactSheetPreview**: Frame label bars, crosshair placeholder with `img-grid-bg` pattern.
- **ImageUploadZone**: Loaded state shows as metadata panel with section header bar. Drop zone with thinner crop marks.

### Global CSS
- Added `img-grid-bg` utility class (subtle grid pattern for image placeholder areas).
- Added minimal scrollbar styling.
- Tightened `:root` tokens.

---

## 4. Files Changed

**Styles:**
- `frontend/app/globals.css`

**Components:**
- `frontend/components/ui/navbar.tsx`
- `frontend/components/ui/footer.tsx`
- `frontend/components/ui/button.tsx`
- `frontend/components/ui/card.tsx`
- `frontend/components/ui/badge.tsx`
- `frontend/components/ui/placeholder-page.tsx`
- `frontend/components/workflow/workflow-stepper.tsx`
- `frontend/components/preview/contact-sheet-preview.tsx`
- `frontend/components/upload/image-upload-zone.tsx`

**Pages:**
- `frontend/app/page.tsx` (landing page — complete redesign)
- `frontend/app/app/attack-lab/page.tsx` (select styling update)

---

## 5. Validation Results

- `npm run build`: **PASS**
- TypeScript: **PASS**
- No functional logic changed
- No API endpoints changed
- No backend files changed
- No hooks modified
- No service layer modified

---

## 6. Functional Safety Confirmation

The following were **not modified**:
- DCT algorithm (`backend/app/watermark/`)
- Embedding / extraction logic
- Secret key PRNG
- PSNR / NC / BER metrics
- Attack Lab service calls
- FastAPI endpoints
- React state management hooks
- API service layer (TypeScript)
- Image upload hooks

All page functionality remains identical. Only visual/CSS/layout layer was changed.
