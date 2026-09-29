# Jayking Portfolio V2 — Motion Rebuild

This version rebuilds the first impression and fixes the entry interaction.

## Fixed
- `ENTER PORTFOLIO` now has three layers of reliability: normal link behavior, inline fallback, and the main JS transition handler.
- Removed the old session-based auto-skip behavior so the entry experience consistently appears when the site is opened.
- Added cache-busting query versions to CSS and JavaScript so Vercel/browser caches do not keep serving the older broken interaction.
- The main portfolio is hidden while the cinematic gate is active, so content no longer bleeds through the welcome screen.
- Mobile now keeps the Chess King PFP visible instead of hiding it.

## New entry experience
- animated gold/green aurora lighting
- moving contour field and perspective grid
- light sweep/ray animation
- live status frame and micro typography
- floating multi-ring Chess King system
- orbiting nodes and labels
- PFP light sheen + scan line
- mouse-reactive 3D tilt and parallax on the PFP
- animated CTA progress line
- cinematic exit transition into the portfolio
- richer mobile-specific composition

## Main portfolio polish
- reactive PFP movement on the main hero
- upgraded ambient signal canvas
- richer dark gold/green background lighting
- improved visual depth without adding a heavy 3D library
- reduced-motion support remains enabled

## Test status
The rebuilt entry was rendered at desktop (1440×960) and mobile (390×844). The Enter button was interaction-tested in a headless Chromium browser and successfully hides the gate and opens the portfolio.
