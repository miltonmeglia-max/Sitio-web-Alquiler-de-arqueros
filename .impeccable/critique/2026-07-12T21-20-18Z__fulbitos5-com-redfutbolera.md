---
target: "https://fulbitos5.com/redfutbolera (Red Futbolera search page)"
total_score: 19
p0_count: 0
p1_count: 3
timestamp: 2026-07-12T21-20-18Z
slug: fulbitos5-com-redfutbolera
---
Method: dual-agent (A: a417c4cc925a06b1b · B: a8a6900a78a970ec0)

**Correction (post-review, verified by a real click, not a static DOM check)**: the "P0 — Register CTA is completely dead" finding below is a **false negative** and is retracted. Assessment A concluded "dead" from the absence of an `href`/`onclick` attribute, but the CTA's handler is attached via JS (React), invisible to a static attribute check. Clicking it for real navigates to Google's OAuth consent screen via a Supabase Auth callback (`*.supabase.co/auth/v1/callback`) — the founder already has Google Sign-In via Supabase wired up on this page. Total score and heuristics below are not re-computed for this correction; treat the P0 item and heuristic #4/#10 commentary about the CTA specifically as void, everything else stands.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Live "X disponibles" counter is a nice touch, but the disabled submit button never explains why |
| 2 | Match Between System and Real World | 3/4 | Barrio list correctly changes per Zona |
| 3 | User Control and Freedom | 2/4 | Filters survive "‹ Volver", but a zero-result search is a full dead end |
| 4 | Consistency and Standards | 1/4 | Zona/Barrio/Género are plain unstyled `<div>`s, not real buttons; hamburger menu is dead |
| 5 | Error Prevention | 3/4 | Submit correctly disabled until required fields are set |
| 6 | Recognition Rather Than Recall | 3/4 | Selected chips turn green, dropdowns show the chosen value |
| 7 | Flexibility and Efficiency of Use | 1/4 | No keyboard access at all on the core filters; single rigid path |
| 8 | Aesthetic and Minimalist Design | 2/4 | Clean dark palette undercut by nine separate contrast failures |
| 9 | Help Users Recognize/Diagnose/Recover from Errors | 1/4 | "No hay jugadores disponibles" with zero next step |
| 10 | Help and Documentation | 0/4 | No help anywhere; the ☰ icon that looks like an entry point is dead |
| **Total** | | **19/40** | **Poor** |

## Anti-Patterns Verdict

**LLM assessment**: Doesn't read as generic AI slop at a glance — the dark theme + Spotify-green accent gives it real personality, more than a template gray-on-white page would. But every interactive filter (Zona, Barrio, Género) is a bare `<div>` with no semantic button, link, or ARIA role — confirmed independently by both assessments. Combined with a dead nav icon and a dead secondary CTA, it reads less like "AI-generated" and more like an unfinished wireframe the founder himself already suspected it was.

**Deterministic scan**: The bundled detector, injected live into the page, found **9 anti-patterns, all low-contrast violations**, independently re-verified via computed-style math (exact match, no discrepancy):
- 7× chip/option text `#777777` on `#1a1a1a` → 3.9:1 (needs 4.5:1)
- 2× section-label text `#444444` on `#0d0d0d` → 2.0:1 (needs 4.5:1)
- 1× primary CTA button text `#555555` on `#1a1a1a` → 2.3:1 (needs 4.5:1) — the single most important control on the page fails contrast on its own label

No false positives — every detector finding matched independently recomputed relative-luminance contrast ratios exactly.

**Visual overlays**: Script injection succeeded (no CSP blocking), and the detector logged real findings to console, but the overlay DOM nodes it created were left `display:none` — no user-visible highlight ever rendered in the browser tab. Treat the 9 findings above as verified data, not as something currently visible on-screen.

## Overall Impression

The page's biggest problem isn't how it looks — the dark/green theme has personality — it's that half of what's on screen doesn't actually work. The registration CTA (the page's only growth lever) has no handler at all, the hamburger menu is decorative, and every filter chip is invisible to a keyboard or screen reader. Layered on top, nine real contrast failures make even the working parts hard to read, including the main "Ver jugadores disponibles" button. This scores as a functional wireframe, not a shipped product — which lines up with your own read of it.

## What's Working

- **Live result-count preview**: as soon as required filters are set, the page shows a live "✓ X jugadores disponibles" count before the user even taps submit — reduces the anxiety of a blind search.
- **Bottom-sheet modals for Día/Hora**: real one-thing-at-a-time focus with a scrim, better than a plain inline dropdown would be on mobile.
- **Filter state persistence**: going back from results to search ("‹ Volver") keeps everything the user picked.

## Priority Issues

~~**[P0] Register CTA is completely dead**~~ — **RETRACTED, false negative.** Verified by a real click: it navigates to Google's OAuth screen via Supabase (`*.supabase.co/auth/v1/callback`). Google Sign-In is already wired up here. Static DOM inspection missed the JS-attached handler.

**[P1] Zero-result search is a true dead end**
- Why it matters: Confirmed with a real filter combo (Zona Sur/Quilmes/Lunes/20:00) — the submit button goes fully disabled and the only message is "No hay jugadores disponibles para ese horario," with no suggested next step. For a brand-new marketplace with few registered players, this is likely the *most common* outcome a visitor sees, and it currently reads as a broken product rather than "try another time."
- Fix: Keep the button tappable, replace the flat error with an empty state that offers a next action (try another zone/time, or the same signup CTA once P0 is fixed).
- Suggested command: `/impeccable clarify`

**[P1] Contrast fails across the page, including on the primary CTA itself**
- Why it matters: Nine separate contrast failures, all quantified: section labels at 2.0:1, chip text at 3.9:1, and — most damaging — the "Ver jugadores disponibles" button text at 2.3:1. All are well under the 4.5:1 WCAG AA minimum. This isn't a nitpick; the single most important action on the page is hard to read for a meaningful share of users, on top of anyone with low vision.
- Fix: Raise label/chip/button text toward the ink end of the palette (roughly #a0a0a0+ on this background family) and re-check against 4.5:1.
- Suggested command: `/impeccable audit`

**[P1] Core filter controls have no keyboard/screen-reader access, and the nav icon is dead**
- Why it matters: Zona, Barrio, and Género are plain `<div>`s with no role, tabindex, or ARIA label — confirmed invisible to the accessibility tree at both desktop and mobile widths. The hamburger (☰) menu produces no DOM change on click and shows no focus outline. Only 4 real interactive elements exist on the entire page (hamburger, 2 dropdown buttons, the submit button) — none of the actual filter choices are among them.
- Fix: Rebuild filters as real buttons/inputs with visible focus states; implement or remove the hamburger menu.
- Suggested command: `/impeccable harden`

**[P2] Result data is inconsistent, and secondary touch targets run small**
- Why it matters: Search results show duplicate entries (two identical "Nacha" rows, one of which links to a club Instagram rather than a person) and inconsistent contact methods (only some results expose WhatsApp). Separately, Género chips (~34px tall) and the hamburger (36×30px) fall under the 44px touch-target minimum on mobile — though Zona chips (164×44px) are actually fine, so this isn't uniform across the page.
- Fix: Dedupe/normalize result listings and their contact CTA; bump Género chip and hamburger hit areas to ≥44px.
- Suggested command: `/impeccable polish`

## Persona Red Flags

**Jordan (Confused First-Timer)**: Can't reliably read the ZONA/BARRIO/DÍA/HORA/GÉNERO section labels (2.0:1 contrast) — the page's own signposting is nearly invisible to someone unfamiliar with the flow. The ☰ icon looks like the obvious "how does this work" entry point and does nothing when tapped.

**Casey (Distracted Mobile User)**: Género chips (~34px tall) and the hamburger (30px) sit below comfortable one-handed tap targets among otherwise-packed options; a mis-tap is likely mid-scroll. Zona chips, by contrast, are sized fine (164×44px).

**Riley (Deliberate Stress Tester)**: Empty required fields correctly block submit (good), but a real, plausible zero-result combo (Zona Sur / Quilmes / Lunes / 20:00) also disables the button entirely with no recovery path — and the natural fallback, the signup CTA, is dead. Riley hits a wall two different ways in the same flow.

## Minor Observations

- Hora dropdown only offers 16:00–23:00 — no morning/afternoon slots, which may not match how amateur football is actually scheduled across all zones.
- Zero native `<select>` or `<a>` elements exist anywhere on the page; everything interactive is hand-rolled.
- The detector's overlay elements exist in the DOM but are hidden (`display:none`) — the 9 findings are real and verified, just not currently visible as an on-page highlight.

## Questions to Consider

- If the signup CTA is dead, is this page currently a one-way funnel that captures seeker intent but never grows the player pool it depends on to have any results to show?
- Why disable the submit button on a zero-result forecast instead of showing a proper empty state with a next step?
- Is this the real production build being validated, or a throwaway prototype — because right now, functionally, it reads as the latter.
