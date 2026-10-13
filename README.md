# Hanna Katz, RCC — practice website

A warm, art-based counselling site for **Hanna Katz, Registered Clinical Counsellor (RCC), BCACC #29269** — teens, young adults & families, Greater Vancouver. Virtual sessions now; in-person by arrangement.

Plain static site (HTML/CSS/JS). No build step, no framework, no dependencies. Deploys anywhere.

## Quick start (preview locally)

```bash
cd therapia
python3 -m http.server 8080
# then open http://localhost:8080
```

Or just open `index.html` in a browser (the intro video and fonts work best via the local server above).

## Going live — the one file to edit

Everything you normally need is in **`config.js`**:

| Field | What to set |
|---|---|
| `janeBookingUrl` | Hanna's Jane booking link, e.g. `https://hannakatz.janeapp.com`. Until it's set, every "Book online" button politely routes to the contact form. |
| `formEndpoint` | A [Formspree](https://formspree.io) form endpoint (free) so the contact form emails Hanna, e.g. `https://formspree.io/f/abcdwxyz`. |
| `contactEmail` | Email used for the "Write to Hanna" link and as the form's fallback if `formEndpoint` is blank. |
| `linkedinUrl` | Hanna's LinkedIn profile (already filled in). |

The contact form works in three modes automatically:
1. **Formspree** if `formEndpoint` is set (recommended).
2. **mailto** fallback if only `contactEmail` is set (opens the visitor's email app).
3. A gentle "reach out via LinkedIn" note if neither is set.

## Deploying

Any static host works. Easiest free options:

- **Netlify / Vercel** — drag-and-drop the folder, or connect the git repo. No settings needed (publish directory = project root).
- **GitHub Pages** — push to GitHub, enable Pages on the `main` branch, root folder.
- **Cloudflare Pages** — connect repo, build command empty, output dir `/`.

A custom domain (e.g. `hannakatz.ca`) can be pointed at any of these.

## Content & assets

| File | Notes |
|---|---|
| `index.html` | All page copy, drawn from Hanna's bio. Edit text directly here. |
| `assets/img/tree.png` | Watercolour tree brand art (from the LinkedIn banner). |
| `assets/img/banner-full.png` | Full banner, used as the social-share preview image. |
| `assets/video/intro.mp4` | Hanna's intro video, web-optimised (4.4 MB, portrait). |
| `assets/video/intro-poster.jpg` | Video poster frame. |
| `assets/img/favicon.svg` | Tree favicon. |

### Replacing the intro video
Drop a new file at `assets/video/intro.mp4` and a poster at `assets/video/intro-poster.jpg`. To re-compress a large source:
```bash
ffmpeg -i source.mp4 -vf "scale=-2:960" -c:v libx264 -crf 30 -movflags +faststart -c:a aac -b:a 96k assets/video/intro.mp4
ffmpeg -ss 10 -i source.mp4 -frames:v 1 -vf "scale=-2:960" assets/video/intro-poster.jpg
```

## Notes
- **English-only v1.** Copy and markup are structured so Hebrew (RTL), Russian & Ukrainian can be added later.
- A **BC crisis-resources** note (911 / 988 / 310-6789) is included near the footer — please keep it.
- Not medical/legal advice; confirm fee, insurance and intake wording with Hanna before launch.
