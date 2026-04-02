```markdown
# Design System Strategy: The Sovereign Archive

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Sovereign Archive."** 

This is not a standard SaaS tool; it is a cinematic, editorial experience designed for the highest echelons of legal practice. It mimics the weight and authority of a Manhattan law firm’s private library, translated into a digital medium. We achieve this by rejecting the "bubbly" trends of modern web design in favor of **Architectural Rigor**. 

The aesthetic is defined by intentional asymmetry, hard 0px edges, and a "High-Contrast Noir" atmosphere. By utilizing deep obsidian surfaces and surgical platinum-gold accents, we create an environment that commands focus and signals elite status. Elements do not simply "sit" on a page; they emerge from the darkness through tonal layering and light-based signifiers.

## 2. Colors & Surface Philosophy
The palette is rooted in the "Obsidian" spectrum, ranging from absolute depths to metallic highlights.

*   **Primary Accent (Platinum Gold):** Use `primary` (#f2ca50) for interactive elements and `primary_container` (#d4af37) for sophisticated branding moments.
*   **The Obsidian Base:** The core background is `surface_container_lowest` (#0e0e0e) or `surface_dim` (#131313). This provides the "Absolute Black" foundation required for a cinematic feel.
*   **The "No-Line" Rule:** Standard 1px borders are strictly prohibited for sectioning. Structural boundaries must be defined by shifts in background tone. Use `surface_container_low` for secondary content areas against a `surface` background.
*   **Surface Hierarchy & Nesting:** Depth is achieved by "stacking" the Obsidian tiers. A search bar (highest priority) should be `surface_container_highest` (#353534) sitting atop a `surface_container_low` (#1c1b1b) sidebar. This creates a physical sense of "elevation" without traditional shadows.
*   **The "Glass & Gradient" Rule:** For "Protected" or "Elite" content elements (e.g., restricted case files), apply Glassmorphism. Use `surface_variant` at 40% opacity with a 20px backdrop-blur. Main CTAs should feature a subtle linear gradient from `primary` to `primary_container` at a 135-degree angle to simulate the sheen of real gold.

## 3. Typography: Editorial Authority
The typographic system is a dialogue between tradition and precision.

*   **The Authority (Serif):** Use `notoSerif` for all `display`, `headline`, and `title` roles. This evokes the prestigious "Manhattan law firm" aesthetic. It should be typeset with slightly tighter letter spacing (-0.02em) to feel urgent and professional.
*   **The Precision (Sans-Serif):** Use `manrope` for `body` and `label` roles. This is a high-legibility, crisp typeface designed for reading dense legal briefs.
*   **Hierarchy as Narrative:** Use extreme scale contrast. A `display-lg` headline should tower over `body-md` text to create an editorial, magazine-like layout that guides the eye to the most critical information first.

## 4. Elevation & Depth: Tonal Layering
In this system, we do not use "drop shadows" to indicate importance. We use light and opacity.

*   **The Layering Principle:** Treat the UI as layers of dark obsidian glass. Move an element "closer" to the user by stepping up the surface container tier (e.g., from `surface_container_low` to `surface_container_high`).
*   **Ambient Shadows:** If a floating element (like a context menu) requires separation, use an ultra-diffused shadow: `box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5)`. Never use a harsh, dark grey shadow.
*   **The "Ghost Border":** Per the cinematic requirement, when a container needs a hard edge for accessibility, use a **0.5px** border using the `outline_variant` token at 20% opacity. It should be felt rather than seen.
*   **Signature Glow:** Interactive elements do not just change color; they emit light. Buttons on hover should utilize a `primary` gold outer glow (`box-shadow: 0 0 15px rgba(212, 175, 55, 0.4)`).

## 5. Components

### Buttons
*   **Shape:** 0px border-radius (Strictly Square).
*   **Primary:** Background of `primary_container`. On hover, transition to `primary` with a Gold Glow effect.
*   **Tertiary:** No background, 0.5px Ghost Border. Use for low-priority legal citations.

### Cards & Lists
*   **Construction:** Forbid the use of divider lines. Separate items using the `Spacing Scale`. A `12` (4rem) gap between major list items provides the necessary breathing room for an elite experience.
*   **Interactive Cards:** On hover, shift the background from `surface_container_low` to `surface_container_high`.

### Input Fields
*   **Styling:** 0.5px border on the bottom only (Editorial style). Use `notoSerif` for the label to maintain the prestigious tone, while the input text itself uses `manrope` for clarity.
*   **Error State:** Use `error` (#ffb4ab) but keep the 0.5px border thickness to maintain the cinematic "thin-line" aesthetic.

### Glass Modals (Protected Elements)
*   Used for "Elite" search results or sensitive documents.
*   **Surface:** `surface_variant` at 60% opacity.
*   **Blur:** 24px backdrop-filter.
*   **Border:** 0.5px `primary_fixed_dim` at 30% opacity to create a "gold-leaf" edge.

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetry:** Place a `display-lg` headline off-center to create a bespoke, custom-coded feel.
*   **Embrace the Dark:** Allow large areas of `surface_container_lowest` (#0e0e0e) to exist. Negative space is a luxury.
*   **Strict Edges:** Ensure every single component has a 0px radius. Any curve breaks the "Sovereign Archive" logic.

### Don't:
*   **No 1px Lines:** Never use the standard 1px default. It looks "off-the-shelf." Stick to 0.5px or nothing.
*   **No Generic Grids:** Avoid the "three-card-row" bootstrap look. Vary widths and heights to mimic a premium law journal.
*   **No Grey Shadows:** If a shadow is needed, it should be a tint of the background or a glow of the accent—never a flat neutral grey.

---
**Director's Note:** This system is about the "quiet power" of law. Every 0.5px line and every Noto Serif serif must feel intentional. If it looks like a standard dashboard, you have failed the brief. It should look like a secret.```