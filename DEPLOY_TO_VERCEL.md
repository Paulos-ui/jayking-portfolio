# Deploy Jayking Portfolio V2 to Vercel

This portfolio is a static HTML/CSS/JavaScript site. There is no build step and no environment variable required.

## If your V1 is already on GitHub + Vercel

This is the easiest update path.

1. Unzip `Jayking_Portfolio_V2.zip`.
2. Copy the contents of the `jayking-portfolio` folder over the files in your existing portfolio repository.
3. Commit and push:

```bash
git add .
git commit -m "Upgrade Jayking portfolio to V2 motion experience"
git push
```

4. Vercel will automatically redeploy the connected repository.
5. When deployment finishes, open the site in an incognito/private browser window once to confirm the new entry screen.

The CSS and JavaScript URLs in V2 include a version query (`?v=2.2`) to reduce the chance of an old browser cache serving the V1 files.

## Fresh GitHub deployment

Create a new repository, then from inside the unzipped project folder:

```bash
git init
git add .
git commit -m "Launch Jayking portfolio V2"
git branch -M main
git remote add origin https://github.com/Paulos-ui/jayking-portfolio.git
git push -u origin main
```

Then:

1. Go to Vercel.
2. Select **Add New → Project**.
3. Import the GitHub repository.
4. Framework preset: **Other**.
5. Build command: leave empty.
6. Output directory: leave empty/default.
7. Click **Deploy**.

## Custom domain later

In Vercel open **Project → Settings → Domains**, add the domain you buy, then follow Vercel's DNS instructions.

Suggested structure once a domain is connected:
- `yourdomain.xyz` — main portfolio
- `yourdomain.xyz/#builder` — builder work
- `yourdomain.xyz/#content` — writing
- `yourdomain.xyz/#community` — community
- `yourdomain.xyz/#motion` — motion
- `yourdomain.xyz/#resumes` — resume vault

## Important before replacing V1

Keep the current V1 deployment until V2 finishes deploying successfully. Vercel keeps deployment history, so you can also roll back from the Vercel dashboard if needed.
