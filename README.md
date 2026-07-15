# Sneharaksha Hospital — Hospital Website

A single-page hospital website built with plain HTML, CSS, and vanilla JavaScript (no build step, no frameworks). Made as a competition-ready front-end demo.

**Current theme: Blush & Beige** — mauve-rose (#B76E79), blush pink (#EFA1B2 / #FFD6E0), warm beige (#F2E5D5 / #DCC9B9), near-white (#FAFAFA). All colors live as CSS custom properties at the top of `assets/css/styles.css`, so swapping to a different palette later only means editing that one `:root` block.

## How to run

**Option 1 — just open it**
Double-click `index.html` and it opens in your browser. Everything (fonts aside) works offline.

**Option 2 — local server (recommended, avoids any browser file:// quirks)**
```
# Python
python3 -m http.server 8000
# then open http://localhost:8000

# or Node
npx serve .
```

## What's inside

```
index.html            → all page markup/sections
assets/css/styles.css → design system + layout + animations
assets/js/main.js     → all interactivity (vanilla JS, no dependencies)
```

## Features

- Sticky header that compacts on scroll, with a mobile hamburger drawer
- Dark mode toggle and a text-size accessibility toggle
- **Heartbeat logo** — the header/footer mark gently beats on a lub-dub rhythm
- **Real-time hospital clock** — live date/time in the top strip, with an
  auto-computed "OPD Open / OPD Closed · ER Open 24/7" status badge
- **Interactive floor directory** — click a floor to see what's on it
  (facilities + hours), wayfinding-style
- **Quote of the day** — a different care-related quote is chosen at random
  on every page load/refresh
- **Floating live status widget** — a dismissible pill in the corner showing
  a simulated live ER wait time that quietly updates every ~25s
- Animated hero "pulse line" (SVG heartbeat draw-on animation)
- Animated counters that count up when scrolled into view
- Interactive body map — click a body region to see the matching department
- Department cards, doctor carousel (prev/next controls, with real doctor
  photos), and an auto-rotating patient testimonial slider with dot navigation
- A 3-step appointment booking form with inline validation and a success state
- Newsletter signup (front-end demo, no backend)
- Fully responsive down to mobile; respects `prefers-reduced-motion`;
  visible keyboard focus states throughout

## Notes

- All hospital/doctor/patient details are fictional, written for this demo.
- Fonts (Fraunces, Inter, IBM Plex Mono) load from Google Fonts via CDN link
  tags in `index.html` — if you need a fully offline version, download those
  font files and swap the `<link>` tags for local `@font-face` rules.
- No backend: the booking form and newsletter form simulate success in the
  browser only. Wire up `main.js`'s submit handlers to your API if needed.
