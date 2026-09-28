# PHASE — STRONG BLACK UI REFINEMENT

## 1. Visual Goal & Concept

The core visual objective was to transform the interface from a "soft gray SaaS" look to a "black ink on editorial paper" aesthetic. This involved establishing a much stronger monochromatic hierarchy: using pure black (`#000000`) for structural and focal elements, removing mid-gray borders, increasing typographic weight, and stripping away unnecessary radius and softness.

## 2. Refinement Details

### Color System
- Set `--background` to an off-white `#F7F7F5`.
- Set `--surface` to pure white `#FFFFFF`.
- Redefined primary text to pure black `#000000`, secondary to `#222222`, and muted to `#444444`.
- Replaced soft `--border-strong` lines with pure `#000000`.

### Typography
- Enforced `font-weight: 900` on hero headings and metrics.
- Enforced `font-weight: 700` (bold) on standard buttons, technical labels, and component headers.
- Replaced muted paragraph colors with `#222222` to ensure reading contrast.

### Components
- **Buttons**: Primary buttons are now `bg-[#000000]` with `font-bold`. Secondary buttons have a 1px black border. Replaced generic gray borders. Increased hit target sizes (h-10 / h-11) for better usability.
- **Navbar**: Brand text is pure black, active navigation has a `border-b-2` underline in black.
- **Cards**: All structural wrappers (Image Upload, Watermark Config, Results Tables) were given `border-[#000000]` rather than soft gray `border-border`.
- **Inputs**: Text fields and selects now have a white background, black border, `#000000` text, and a strong black focus ring `focus:ring-2 focus:ring-[#000000] focus:ring-offset-1`.
- **Contact Sheet**: Replaced the soft 1px gap background with `#000000` to create sharp, solid black framing lines around the images. The crosshair placeholder is now drawn with `#000000` lines.

### Pages
- **Landing Page**: The hero section was given `font-weight: 900` typography. The CTA banner has a `border-2 border-[#000000]` frame.
- **Protect / Detect / Attack / Results**: Metrics were updated to use a unified `.metric-value` utility class (`font-weight: 900`, `1.5rem`). Section headings (e.g. "Session", "Baseline", "Summary") were given `font-bold` and `#000000` color to command hierarchy.

## 3. Validation

- `npm run build`: **PASS**
- TypeScript check: **PASS**
- Hydration Mismatch: **NONE**
- Architecture / Functionality: Unchanged
- Backend / Logic: Unchanged
