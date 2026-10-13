# Hanna Katz, RCC — practice website

A warm, art-based counselling site for **Hanna Katz, Registered Clinical Counsellor (RCC), BCACC #29269** — teens, young adults & families, Greater Vancouver. Virtual sessions now; in-person by arrangement.

Plain static site (HTML/CSS/JS). No build step, no framework, no dependencies. Deploys anywhere.

## Quick start (preview locally)

```bash
cd therapia/public
python3 -m http.server 8080
# then open http://localhost:8080
```

The site lives in **`public/`** (that's the web root Cloudflare serves — see `wrangler.jsonc`).
Edit `public/index.html`, `public/config.js`, and files under `public/assets/`.

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
| `assets/img/services/*.webp` | Hand-sketch illustrations, one per service card. |
| `assets/img/about-hanna.webp` | **Placeholder** illustration in the About section. |
| `assets/img/favicon.svg` | Tree favicon. |

### Hanna's portrait (About section)
`assets/img/about-hanna.webp` is a **placeholder sketch**. Once Hanna shares a photo, it
can be turned into a matching hand-sketch portrait and dropped in at the same path.

### The service sketches & the generator
The five service illustrations were generated to match the brand (soft pencil + watercolour,
muted earthy palette) via an OpenRouter image model, using `tools/generate-sketch.py`.
It reuses the OpenRouter key from the sibling `indie` repo's `.env`.

```bash
python3 tools/generate-sketch.py check          # confirm the key loads
python3 tools/generate-sketch.py gen --out new.png \
  --prompt "soft pencil + watercolour, muted earthy palette, cream background, no text — <scene>"
# then optimise + place:
cwebp -q 80 -resize 1100 0 new.png -o assets/img/services/<name>.webp
```
Note: the image model's safety filter blocks prompts depicting children's faces — frame such
scenes from behind or with faces not visible (as the "Families" sketch does).

## Notes
- **English-only v1.** Copy and markup are structured so Hebrew (RTL), Russian & Ukrainian can be added later.
- A **BC crisis-resources** note (911 / 988 / 310-6789) is included near the footer — please keep it.
- Not medical/legal advice; confirm fee, insurance and intake wording with Hanna before launch.
