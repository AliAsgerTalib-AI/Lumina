# Lumina: Google Stitch UI/UX Design System Specification
## Epistemic Integrity & Dual-Mode Multi-Dimensional Scientific Adapters

This document defines the **Google Stitch Design System** specification for Lumina. It serves as the unified blueprint for engineering, detailing the cohesive modular tokens, design systems, UI components, adaptive layout scaffolds, and state transition pipelines that power the system.

---

## 🗺️ 1. Core Vision & Principles

Lumina is designed on the principle of **Stitched Scientific Cohabitation**—unifying non-technical translation with high-density physical precision inside a modular, single-page landscape.

1.  **Truth First, Decoration Never:** No telemetry theater, terminal simulations, or ungrounded animations. Every visual component represents measurable document structures or real verification pipelines.
2.  **Harmonized Cognitive Thresholds:** Seamless transitions between conceptual plain-language abstracts and granular statistical proofs, allowing instant scaling of information depth.
3.  **Physical Tactility (Library Motif):** Uses physical parchment tones, organic slate accents, and standard letterpress weights, mimicking high-grade academic journals to inspire reading focus.

---

## 🎨 2. Stitch Global Design Tokens

Lumina uses a highly disciplined scale of Design Tokens mapping directly to physical paper stocks, academic inks, and deterministic status alerts.

### 2.1 The Ink & Parchment Color Token System
All color paths mapped inside the tailwind ecosystem run on strict high-contrast AAA ratios:

| Token Name | Hex Code | Canvas Role | WCAG AAA Ratio |
| :--- | :--- | :--- | :--- |
| `color-canvas-base` | `#FAF8F5` | Warm Sand. Soft paper background to reduce reading astigmatism. | Base |
| `color-canvas-surface` | `#FFFFFF` | Core module frames, cards, and adaptive content decks. | 1.1:1 |
| `color-ink-primary` | `#2D2D24` | Deep Charcoal Ochre. Body typography, labels, titles. | 13.4:1 (on base) |
| `color-ink-secondary` | `#5A5A4A` | Olive Gray. Meta-captions, parameters, and disabled triggers. | 7.2:1 (on base) |
| `color-brand-forest` | `#7C8464` | Forest Slate. Primary highlight, action focus, branding elements. | 4.6:1 (on sand) |
| `color-brand-muted` | `#F2EDE4` | Pressed Linens. Separation rules, board borders, input strokes.| Border |
| `color-epistemic-gold` | `#B58A3D` | Amber glow. Indicating simulated educational/dialectic systems. | Status |
| `color-verdict-pass` | `#22C55E` | Emerald. Pure verified grounding matching string subset criteria. | Success |
| `color-verdict-fail` | `#EF4444` | Alizarin Crimson. Grounding gaps or unvalidated claims. | Alert |

### 2.2 Typographic Pairings
```
┌─────────────────────────────────────────────────────────────┐
│ DISPLAY SERIF (Playfair Display / Editorial Serif)          │
│   Usage: Document Headers, Major View Titles, Analogy Hooks │
│   Attributes: font-serif, tracking-tight, font-bold         │
├─────────────────────────────────────────────────────────────┤
│ HIGH-LEGIBILITY SANS (Inter / System Sans)                  │
│   Usage: Body Copy, Dialectics, Multi-Column Fields         │
│   Attributes: font-sans, leading-relaxed, text-slate-800    │
├─────────────────────────────────────────────────────────────┤
│ ACCURATE MONO (JetBrains Mono / Code Mono)                  │
│   Usage: Page Indexing, Metric Units, Citation Tokens       │
│   Attributes: font-mono, text-xs, tracking-widest           │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Spacing Scale & Border Densities
-   **Padding Standard:** Fluid margins using `p-4` (compact) up to `p-7` (generous negative space cards).
-   **Rounding Matrix:** All card containers must use `rounded-[32px]` for balanced architectural weight. Badges use custom pill configurations (`rounded-full` or `rounded-xl`).
-   **Border Widths:** 1px defined styling (`border border-[#F2EDE4]`) mimicking classical ink lines.

---

## 🏛️ 3. Stitched Component Architecture

Lumina is built from autonomous, hot-swappable UI components that "stitch" together to create a cohesive dashboard.

### 3.1 The Dual-Mode Adaptive Lens Core
Renders the primary scientific text in two completely disparate density modes:

```
                  ┌────────────────────────────────────────┐
                  │        DYNAMIC DENSITY TOGGLE          │
                  │ [ 🍃 Intuitive Mode ] [ ⚖️ High-Density]│
                  └───────────────────┬────────────────────┘
                                      │
            ┌─────────────────────────┴─────────────────────────┐
            ▼                                                   ▼
┌───────────────────────────┐                       ┌───────────────────────────┐
│ CONCEPTUAL ABSTRACT ADAPTR│                       │ DETAILED PEER REVIEW DECK │
├───────────────────────────┤                       ├───────────────────────────┤
│ • Clear Metaphorical Hook │                       │ • Exact statistical metrics │
│ • Plain-English Transl.   │                       │ • Page-level source bounds│
│ • Interactive Glossary    │                       │ • Verbatim proof quotes   │
└───────────────────────────┘                       └───────────────────────────┘
```

### 3.2 The Grounding Verification Matrix (Exact Math)
A core scientific constraint. Every quote is parsed through a math post-validation pipeline inside `/server/grounding.ts`:

1.  **Normalization Processor ($\mathcal{N}$):**
    $$\mathcal{N}(String) = \text{lowercase}(String) \text{ stripped of glyphs and collapsed into clean spaces}$$
2.  **Verbatim Validation Conditions:**
    *   If $\mathcal{N}(Quote) \subseteq \mathcal{N}(Page_{\text{Target}})$: Render **[P-1-2] PREMIUM VERIFIED** (Pristine Forest Seal).
    *   If $\mathcal{N}(Quote) \subseteq \mathcal{N}(Document_{\text{All\_Pages}})$: Correct badge mapping to the correct physical layout coordinate.
    *   If words intersection count $\ge 75\%$: Render **FUZZY CORRELATION VERIFIED** (Amber Badge).
    *   Else: Render **UNVERIFIED HOOK** with immediate scarlet warnings.

### 3.3 The Scholarly Dialectics Matrix
A three-column grid tracking how a paper interacts with the broader community:
```
┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
│ Supportive Replications │    Critical Friction    │ Methodology Variations  │
├─────────────────────────┼─────────────────────────┼─────────────────────────┤
│ Real-world validations  │ Active disagreements,   │ Swapping models, other  │
│ showing stable claims.  │ bounds, and critiques.  │ physical setups.        │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

### 3.4 Interactive Reviewer #3 Arena
A stress-testing simulator letting readers manipulate physical variables to witness model limits:
-   **Static/Interactive Parameter Sliders:** Learning rates, model depths, or experimental conditions.
-   **Epistemic Warning Banner:** Deep amber color tone emphasizing that peer variables model plausible hypothetical dialectics rather than direct live quotes.

---

## 📐 4. Adaptive Grid & Layout Matrix

Lumina respects clean horizontal visual rhythms and keeps the viewport stable under all configurations.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             PRIMARY NAVIGATION BAR                          │
│  [🌳 Lumina Seal]                                    [🔄 High-Density Switch]│
├──────────────────────────────────────────┬──────────────────────────────────┤
│                                          │                                  │
│         PRIMARY RESEARCH ADAPTER         │       INTERACTIVE SIDEBAR        │
│         • Catchy Simplified Hook         │       • Epistemic Grounding Docs │
│         • Big Idea Core Metric           │       • Verbatim Paper Sources   │
│         • Real-World Impact Scenarios    │       • Reviewer Arena Terminal  │
│                                          │                                  │
├──────────────────────────────────────────┴──────────────────────────────────┤
│                       THE DIALECTICS & VALIDATION MATRIX                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

-   **Desktop Layout:** Dual column 60/40 screensplit configuration to prevent vertical parsing fatigue.
-   **Mobile Layout:** Fluid 1-column responsive layout prioritizing direct metadata delivery before detailed metric panels.
-   **Side-Document Preview Drawer:** Dynamic Slide-Over frame utilizing `framer-motion` for effortless transitions.

---

## 🔄 5. State Schema & Micro-Interactions

Lumina avoids harsh page reloads, transitioning states smoothly with custom motion presets.

### 5.1 System Interaction Map
1.  **Drop/Import State:** Simple drag border using an organic pulse animation.
2.  **Processing State:** Clean loading indicators pairing an academic spinner with rotating tracking captions (e.g., *"Locating Epistemic Anchors..."*, *"Analyzing Dialectical Friction..."*).
3.  **Active Display State:** Staggered components fade-in (`y: [15, 0]`, `opacity: [0, 1]`) with a duration of 350ms for an elegant, non-intrusive appearance.

### 5.2 Motion Tokens
-   **Transitions:** `ease-in-out` curves exclusively configured using standard library utilities.
-   **Hover effects:** Subtle elevation translates (`hover:-translate-y-0.5 hover:shadow-xs`).

---

## ♿ 6. Accessibility & Inclusivity Baseline

Lumina targets strict compliance standards for visual and cognitive access:

*   **Keyboard Navigation:** All buttons and interactive sliders support direct Tab indices and clear focus rings (`focus-visible:ring-2 focus-visible:ring-[#7C8464]`).
*   **Aria Announcements:** All loading states update the screen-reader state using appropriate parameters.
*   **Contrast Bounds:** Text elements do not sit below a contrast ratio of 4.5:1, ensuring comfortable use in bright or dimly lit rooms.
