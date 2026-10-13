# Deploying to Cloudflare Pages

The site is a static site (no build step). `hannakatztherapy.com` is already on Cloudflare.

## 1. Create the Pages project (connect GitHub)
1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorise GitHub and pick the **`yonatan-katz/therapia`** repo.
3. Build settings:
   - **Framework preset:** `None`
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/`
4. **Save and Deploy.** In ~1 minute the site is live at `https://therapia-xxx.pages.dev`.

Every `git push` to `main` now auto-deploys.

## 2. Attach the custom domain
1. In the Pages project → **Custom domains** → **Set up a custom domain**.
2. Add **`hannakatztherapy.com`** and **`www.hannakatztherapy.com`**.
   Because the domain is already in this Cloudflare account, the DNS records and SSL
   are created automatically. HTTPS is ready within minutes.

## 3. (When `hannakatztherapy.ca` is registered)
Add the `.ca` zone to Cloudflare too, then either:
- **Make `.com` primary, redirect `.ca` → `.com`** (or vice-versa) using
  **Rules → Redirect Rules**: match `hannakatztherapy.ca/*` → `https://hannakatztherapy.com/$1` (301).
- If you'd rather make **`.ca` the primary site**, change the `canonical`/`og:url`/`og:image`
  URLs in `index.html` to `https://hannakatztherapy.ca/` and point the Pages custom domain there,
  then redirect `.com → .ca`.

## Notes
- **Contact form:** set `formEndpoint` in `config.js` to a free Formspree endpoint (works on any
  static host). Netlify Forms would be an alternative only if hosting moved to Netlify.
- **Jane booking:** set `janeBookingUrl` in `config.js` once Hanna's Jane page is live.
- No secrets live in this repo; nothing to configure as environment variables.
