# Deploy Jayking Portfolio to Vercel

This V1 is a static site, so there is **no build step** and no environment variable required.

## Option A — GitHub + Vercel (recommended)

1. Create a new GitHub repository, for example `jayking-portfolio`.
2. Unzip this folder on your computer.
3. Open a terminal inside the folder.
4. Run:

```bash
git init
git add .
git commit -m "Launch Jayking portfolio v1"
git branch -M main
git remote add origin https://github.com/Paulos-ui/jayking-portfolio.git
git push -u origin main
```

5. Go to Vercel and choose **Add New → Project**.
6. Import `Paulos-ui/jayking-portfolio`.
7. Framework Preset: **Other**.
8. Build Command: leave blank.
9. Output Directory: leave blank.
10. Click **Deploy**.

Vercel will give you a temporary domain such as:

`jayking-portfolio.vercel.app`

Every future push to `main` will deploy automatically.

## Option B — Vercel CLI

Install the CLI:

```bash
npm i -g vercel
```

Then from this folder:

```bash
vercel
```

Follow the prompts. For production:

```bash
vercel --prod
```

## Connect your own domain

In the Vercel project:

1. Settings → Domains.
2. Add the domain you buy, e.g. `jayking.xyz`.
3. Vercel shows the DNS records to add at your registrar.
4. Once DNS verifies, Vercel provisions HTTPS automatically.

Recommended structure after launch:

- `jayking.xyz` — main portfolio
- `jayking.xyz/#builder` — builder lane
- `jayking.xyz/#content` — content lane
- `jayking.xyz/#community` — community lane
- `jayking.xyz/#motion` — motion lane
- `jayking.xyz/#resumes` — resume vault

## Before you share it publicly

- Check all X, Medium, Telegram and GitHub links.
- Confirm each GitHub project you want in “Live Build Library” has its **Website** field filled in.
- Add real motion videos when available.
- Replace or refine any community/project copy if you want more detailed metrics.
- Test once on iPhone/Android and once on desktop.

## Future V2 upgrade path

This static V1 can later be migrated to Next.js without changing the visual concept. The natural V2 additions are:

- individual case-study routes (`/work/umbra`, `/writing/stellar-vietnam`)
- a CMS for projects/writing
- richer route transitions
- video showreel / motion case studies
- analytics
- role-specific share links and OpenGraph cards
