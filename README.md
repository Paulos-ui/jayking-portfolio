# JAYKING — Portfolio V1

A custom, motion-led Web3 portfolio for **Jayking** — Builder · Developer · Content Strategist · Community Operator · Spaces Host · Motion Designer.

## What is included

- Cinematic welcome / “Enter the Board” screen
- Interactive role selector: Builder / Content / Community / Motion
- Builder case studies with live + code links
- Automatic GitHub live-site library: pulls every public `Paulos-ui` repo that has a homepage URL
- Selected content portfolio with performance metrics + X links
- Community portfolio for Sugarverse and Robusinpe
- Motion-design lane ready for real video/GIF case studies
- Proof / hackathon / recognition section
- Resume Vault with the Master, Content Writer and Community Manager PDFs
- About + contact + X / GitHub / Medium / Telegram links
- Responsive mobile layout
- Reduced-motion accessibility support
- Zero animation frameworks: the motion system is custom CSS + JavaScript

## Quick local preview

You can open `index.html` directly, but the GitHub live-site sync works most reliably through a local web server.

### Python

```bash
python -m http.server 3000
```

Then open: `http://localhost:3000`

### Node

```bash
npx serve .
```

## Where to edit content

Most portfolio content is in `index.html`.

- Hero / bio: search for `MULTI-DISCIPLINARY WEB3 OPERATOR`
- Builder projects: search for `builder-grid`
- Writing: search for `content-ledger`
- Community: search for `community-board`
- Motion: search for `motion-stage`
- Resumes: search for `resume-grid`

The automatic GitHub live-site sync lives in `app.js` under `syncGithub()`.

## Adding a new resume

1. Put the PDF in `assets/resumes/`.
2. Copy one `.resume-card` block in `index.html`.
3. Change its title, description and `href`.

## Adding motion work

Replace a Motion capability card with a link or video. Recommended pattern:

```html
<a class="motion-piece" href="YOUR_LINK" target="_blank">
  <video autoplay muted loop playsinline poster="./assets/poster.jpg">
    <source src="./assets/your-motion.mp4" type="video/mp4" />
  </video>
  <h3>Project name</h3>
</a>
```

Keep video files compressed for fast mobile loading.

## GitHub live-site sync

The website calls the public GitHub API in the visitor's browser and filters for:

- owner: `Paulos-ui`
- public repositories
- not forks
- repositories with a valid `homepage` field

This means future deployed sites appear automatically if the GitHub repository's **Website / Homepage** field is filled in.

GitHub's unauthenticated API is rate-limited. The portfolio caches results for 30 minutes and falls back to selected sites if the API is unavailable.
