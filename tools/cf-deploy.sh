#!/usr/bin/env bash
# Deploy the site to Cloudflare Pages, headless.
# Credentials are loaded from the sibling indie repo's .env (gitignored):
#   CLOUDFLARE_API_TOKEN=...   (Account: Pages:Edit, Zone: DNS:Edit on the domain)
#   R2_ACCOUNT_ID=...          (reused as the Cloudflare account id)
# Nothing is printed; the token never leaves this machine.
set -euo pipefail

PROJECT="${PROJECT:-therapia}"
ENV_FILE="/Users/hanna300/repos/indie/.env"
SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"

[ -f "$ENV_FILE" ] || { echo "No $ENV_FILE"; exit 1; }
# shellcheck disable=SC1090
CLOUDFLARE_API_TOKEN="$(grep -E '^CLOUDFLARE_API_TOKEN=' "$ENV_FILE" | head -1 | cut -d= -f2- | tr -d '"'"'"'' )"
CLOUDFLARE_ACCOUNT_ID="$(grep -E '^R2_ACCOUNT_ID=' "$ENV_FILE" | head -1 | cut -d= -f2- | tr -d '"'"'"'' )"
export CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID

[ -n "$CLOUDFLARE_API_TOKEN" ] || { echo "CLOUDFLARE_API_TOKEN missing in $ENV_FILE"; exit 1; }
[ -n "$CLOUDFLARE_ACCOUNT_ID" ] || { echo "R2_ACCOUNT_ID (account id) missing in $ENV_FILE"; exit 1; }

echo "Deploying $SITE_DIR -> Pages project '$PROJECT' (account ${CLOUDFLARE_ACCOUNT_ID:0:6}…)"
npx -y wrangler@latest pages deploy "$SITE_DIR" \
  --project-name "$PROJECT" \
  --branch main \
  --commit-dirty=true
