# DoctorCon - Doctor's Conference Event Website

## Project Overview
A static, awwwards-style medical conference website with a Kolkata/Bengali artistic theme. Mobile-first, highly visual, and fully responsive.

## Architecture & Pages
- Multi-page static site with a shared header/footer on every page.
- `index.html` is the immersive homepage with a hero background image and parallax effect.
- Detail pages live in `pages/` with hero banners (parallax background images):
  - `committee.html`, `program.html`, `tariff.html`, `register.html`, `sponsorship.html`, `submit.html`, `contact.html`.

## Tech Stack
- **HTML5** + TailwindCSS (CDN) + custom CSS (`css/styles.css`).
- Inline Tailwind config is repeated per page for custom `warm-*` colors.
- Vanilla JS (`js/main.js`) powers menu toggles, scroll reveal, parallax, and smooth scrolling.

## Design System
- **Colors**: warm-cream (#FDF8F3), warm-sand (#F5EBE0), warm-terracotta (#C8553D), warm-coral (#E07A5F), warm-sage (#4A7C59), warm-forest (#2D5A3D), warm-gold (#D4A574), warm-bronze (#A67C52), warm-charcoal (#2C2C2C), warm-ink (#1A1A1A)
- **Typography**: `Montserrat` (body) + `Space Grotesk` (display/headings)

## Key UI Patterns
- Hero section on `index.html`: Parallax background image with overlay.
- Hero banners on internal pages: `.hero-banner` with background image + gradient overlay + parallax.
- Scroll reveal animation: `.reveal` + `.active` (IntersectionObserver in `js/main.js`).
- Mobile menu: 2-column grid layout with fullscreen overlay.
- Speakers carousel: Auto-scrolling horizontal carousel on homepage.
- Reusable cards: `.bento-card`, `.speaker-card`, `.stat-card`.
- Forms: `.form-shell` styling for static registration/abstract forms.

## Image Guidelines
Images auto-adjust using `object-fit: cover`, but for best results, follow these **recommended sizes/ratios**:

| Image Type | Recommended Ratio | Suggested Size | Notes |
|------------|-------------------|----------------|-------|
| **Hero Background** (homepage) | 16:9 | 1920×1080px min | Will scale to fill viewport height. Use high-quality, landscape images. |
| **Hero Banner** (inner pages) | 21:9 (ultrawide) | 1920×820px | Parallax effect, so image should be ~20% taller than container. |
| **Speaker Photos** | 1:1 (square) | 400×400px | Profile photos, faces should be centered. |
| **Venue/Gallery Images** | 16:10 or 3:2 | 1200×750px | Feature images with good detail. |
| **Bento Card Backgrounds** | 4:3 | 600×450px | When using image backgrounds in bento cards. |
| **Logo/Sponsor Images** | Flexible | 200×80px (max) | PNG with transparency preferred. |

**Tips:**
- All images use `object-fit: cover` and `object-position: center` by default.
- You can upload any size and it will crop/scale automatically.
- For best quality, upload at 2x the display size (retina support).
- Compress images for web (use TinyPNG or similar).
- JPG for photos, PNG for logos/graphics with transparency.

## Conventions
- Replace placeholder assets in `/images` directory.
- All forms are static placeholders (no backend).
- Keep navigation consistent across all pages (Home, Program, Committee, Tariff, Submit, Sponsors, Contact, Register).
- Use `px-6 lg:px-12` padding pattern for consistent left/right spacing.
- Max container width is `max-w-[1400px]` or `max-w-7xl`.

## Development
- Open `index.html` directly in a browser (no build step).
- Update copy/dates/pricing directly in HTML files.
