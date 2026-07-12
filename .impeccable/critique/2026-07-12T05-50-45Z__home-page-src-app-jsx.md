---
target: home page (src/App.jsx, alquilerdearqueros.com)
total_score: 24
p0_count: 2
p1_count: 3
timestamp: 2026-07-12T05-50-45Z
slug: home-page-src-app-jsx
---
Method: dual-agent (A: a7d6c216782351f92 · B: aa94a7c7e42971ca2)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Navbar's `scrolled` state is tracked but never applied to any className (dead code); carousels auto-scroll with no position indicator |
| 2 | Match System / Real World | 3 | Slang copy ("quilombo", "fulbo del laburo") lands well; SaaS-style pricing cards and eyebrow labels don't match how a WhatsApp-based casual service normally talks |
| 3 | User Control and Freedom | 3 | Modal has a close button and back-button handling, but no Escape key and no confirm-before-close |
| 4 | Consistency and Standards | 4 | The (mismatched) design system is applied with real discipline across every section |
| 5 | Error Prevention | 3 | Day/cancha use tap chips; horario/ubicación are unconstrained free text |
| 6 | Recognition Rather Than Recall | 3 | Form favors recognition where possible; no active-section indicator on the long scroll |
| 7 | Flexibility and Efficiency | 2 | No way to save/repeat a booking despite copy describing recurring weekly use |
| 8 | Aesthetic and Minimalist Design | 2 | Identical eyebrow → headline → card-grid rhythm repeats across all 7 sections |
| 9 | Error Recovery | 1 | Backdrop-click closes the modal and wipes all 4 fields instantly, no confirmation |
| 10 | Help and Documentation | 1 | No FAQ; "crédito" refund concept mentioned once with no explanation |
| **Total** | | **24/40** | **Acceptable — significant improvements needed** |

## Anti-Patterns Verdict

**LLM assessment**: The palette (`#0d1117` / `#161b22` / `#30363d`) is GitHub's exact dark-theme hex values plus Spotify's brand green (`#1DB954`) as the sole accent, combined with Inter, `rounded-full` pill CTAs, and an uppercase `tracking-widest` "eyebrow" label above nearly every section (ARQUEROS REALES / CÓMO FUNCIONA / TESTIMONIOS / PRECIOS) followed by a headline with one green phrase and a card grid — the default signature of AI/no-code "modern SaaS" template output. It's internally consistent but is a dev-tool/fintech visual language applied to a cash, WhatsApp-only, weekend-pichanga service. `src/App.css` still contains the entire unused default Vite starter boilerplate, never imported — a sign of unreviewed scaffolding.

**Deterministic scan**: The bundled detector (`detect.mjs`) is not installed in this environment — skipped, no fabricated findings. Mechanical DOM/CSS evidence was gathered instead (see below), which is a valid substitute for markup-pattern scanning.

**Visual overlays**: Screenshot capture failed (tool timeout) in both sub-agent environments; no user-visible overlay was produced. Findings below are instead grounded in live computed-style/DOM inspection, network/console logs, and source review — all concrete, not estimated.

## Overall Impression

The bones are good — real photos, local testimonials, a transparent price split, and a WhatsApp-first booking flow that respects the channel the audience already trusts. But the visual system is a generic dark-mode SaaS template (GitHub dark + Spotify green + pill buttons + uppercase eyebrows) that fights the warm, local, informal copy sitting inside it. That mismatch is very likely what reads as "not attractive": it's polished but impersonal, more fintech dashboard than cancha/barrio. A redesign of the visual identity — not a rebuild of the mechanics or copy — is warranted.

## What's Working

1. **Copy voice** — Authentically Argentine and specific ("quilombo", "atajó de diez", "sin vueltas"), not generic. Should survive any redesign untouched.
2. **WhatsApp-first booking** — Pre-filling day/time/location/format into a formatted WhatsApp message meets users in the channel they already trust, cleaner than a blank chat.
3. **Concrete trust signals** — Real goalkeeper photos with names/zones/match counts, neighborhood-tagged testimonials, and a transparent 3-way price split are the right instinct for a peer-to-peer, cash service.

## Priority Issues

**[P0] Generic dark-SaaS visual identity mismatched to the audience**
- Why it matters: The GitHub-dark + Spotify-green + pill-button + uppercase-eyebrow system reads as a corporate dev-tool template, not a football/cash/WhatsApp service for weekend pichanga. This is almost certainly the source of "doesn't look attractive."
- Fix: Rebuild the palette and section rhythm around football culture (cancha/pasto/jersey tones or a warmer, photography-led identity) instead of GitHub+Spotify; vary structure section-to-section instead of repeating eyebrow→headline→card-grid seven times.
- Suggested command: `/impeccable bolder` or `/impeccable colorize`, followed by `/impeccable typeset` for the repeated eyebrow pattern.

**[P0] Silent data loss on modal dismiss**
- Why it matters: `FormularioModal.jsx`'s backdrop click closes the modal and a `useEffect` wipes all 4 fields instantly, with zero confirmation — one accidental tap outside the sheet while multitasking (Casey persona) erases everything just typed.
- Fix: Don't reset form state on close; only reset after successful submit, or confirm before discarding if any field is filled.
- Suggested command: `/impeccable harden`

**[P1] Price disclosed too late**
- Why it matters: The $20k/$15k/$5k breakdown sits below testimonials; in the modal, the total only appears right before submit, after 4 fields are filled — a late reveal for anyone evaluating whether it's worth it.
- Fix: Surface the price near the hero or at the top of the modal, before asking for info.
- Suggested command: `/impeccable layout`

**[P1] Two competing CTAs at equal visual weight**
- Why it matters: "Reservar arquero" (customer) and "Soy arquero y me sumo" (goalkeeper recruiting) appear together in hero, nav, and mobile menu with matching prominence, muddying who the page is for.
- Fix: Demote the recruiting CTA to a secondary link; keep the hero singularly focused on booking.
- Suggested command: `/impeccable distill`

**[P1] WCAG AA contrast failures on secondary/caption text**
- Why it matters: Measured computed contrast: `text-gray-600` on `#0d1117`/`#161b22` (footer copyright, price captions) = 2.50:1 and 2.29:1 — well under the 4.5:1 AA minimum; `text-gray-500` (match counts, testimonial locations) = 3.58:1, also under 4.5:1. Real readability problem, not a nitpick.
- Fix: Bump `text-gray-600`/`text-gray-500` usages toward the ink end of the gray ramp (e.g. `gray-400`/`gray-300`) wherever they carry real content, not just true filler.
- Suggested command: `/impeccable audit` or `/impeccable colorize`

## Persona Red Flags

**Jordan (Confused First-Timer)**: The CTA `💬 Reservar arquero →` implies "tap and I'm in a chat," but opens a 4-field modal first. Hero shows the booking CTA and the goalkeeper-recruiting CTA at equal weight, forcing a pause to figure out which audience he's in. "Crédito" (punctuality refund) appears once with zero explanation of how it's redeemed. Total price only appears after filling 4 fields, not before.

**Casey (Distracted Mobile User)**: Backdrop-tap-to-close plus instant field-wipe (no confirmation) means one accidental thumb-tap while multitasking erases everything typed — the single most damaging mobile flaw found. Input modality is inconsistent mid-form: day/cancha are tap-chips, but horario/ubicación require summoning the keyboard, a jarring switch in a form promised to take "30 segundos." On the plus side, the full-screen mobile menu gives generous, thumb-friendly tap targets.

## Minor Observations

- Monotonous section rhythm: all 7 sections repeat eyebrow-label → black headline w/ one green phrase → card grid, reinforcing the templated feel independent of color choices.
- Mobile hamburger menu button has no accessible name (`aria-label` missing) — WCAG 4.1.2 failure; screen readers announce only "button."
- Dead code: `Navbar`'s `scrolled` state is computed but never applied to any className (an intended scroll effect that was never finished); `src/App.css` is entirely unused leftover Vite starter boilerplate, never imported by `main.jsx`.
- All images have proper `alt` text, no console errors, no broken network requests (12/12 requests 200), no horizontal overflow at mobile or desktop widths — the engineering hygiene underneath the visual layer is solid.

## Questions to Consider

- If this were a flyer stapled to the fence at the cancha, would it look anything like this page?
- Is this really one product (booking) or two bolted together (booking + recruiting)? Should they have separate visual treatments instead of competing on every screen?
- Given the entire conversion event is "open WhatsApp with a pre-filled message," is the 4-field on-site modal earning its complexity, or would a lighter-weight flow get people into WhatsApp faster with fewer chances to lose their input?
