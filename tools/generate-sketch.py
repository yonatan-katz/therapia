#!/usr/bin/env python3
"""Generate still illustrations via OpenRouter image models, reusing the indie repo's key.

Usage:
  python3 imgen.py check
  python3 imgen.py gen --prompt "..." --out out.png [--model google/gemini-2.5-flash-image] [--ref path.png]
"""
import argparse, base64, json, mimetypes, sys, urllib.request, urllib.error
from pathlib import Path

ENV_PATH = Path("/Users/hanna300/repos/indie/.env")

def load_key():
    key = None
    if ENV_PATH.exists():
        for raw in ENV_PATH.read_text().splitlines():
            line = raw.strip()
            if line.startswith("export "):
                line = line[7:]
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            if k.strip() == "OPEN_ROUTER_KEY":
                key = v.strip().strip('"').strip("'")
    return key

BASE = "https://openrouter.ai/api/v1"

def req(path, body, key, timeout=300):
    data = json.dumps(body).encode()
    r = urllib.request.Request(BASE + path, data=data, method="POST",
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(r, timeout=timeout) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print("HTTP", e.code, e.read().decode(errors="replace")[:1500], file=sys.stderr)
        raise

def data_uri(p):
    p = Path(p)
    mime = mimetypes.guess_type(str(p))[0] or "image/png"
    return f"data:{mime};base64,{base64.b64encode(p.read_bytes()).decode()}"

def gen(prompt, out, key, model, refs=None):
    content = [{"type": "text", "text": prompt}]
    for rf in (refs or []):
        content.append({"type": "image_url", "image_url": {"url": data_uri(rf)}})
    body = {"model": model, "messages": [{"role": "user", "content": content}],
            "modalities": ["image", "text"]}
    res = req("/chat/completions", body, key)
    if "choices" not in res:
        print("No 'choices' in response:", json.dumps(res)[:800], file=sys.stderr)
        sys.exit(3)
    msg = res["choices"][0]["message"]
    imgs = msg.get("images") or []
    if not imgs:
        print("No image returned. Text:", (msg.get("content") or "")[:500], file=sys.stderr)
        print(json.dumps(res)[:1200], file=sys.stderr)
        sys.exit(2)
    url = imgs[0]["image_url"]["url"]
    b64 = url.split(",", 1)[1]
    Path(out).write_bytes(base64.b64decode(b64))
    print("saved", out, f"({len(base64.b64decode(b64))//1024} KB)")

def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("check")
    g = sub.add_parser("gen")
    g.add_argument("--prompt", required=True)
    g.add_argument("--out", required=True)
    g.add_argument("--model", default="google/gemini-2.5-flash-image")
    g.add_argument("--ref", action="append")
    a = ap.parse_args()
    key = load_key()
    if a.cmd == "check":
        print("env:", ENV_PATH, "exists:", ENV_PATH.exists())
        print("key loaded:", f"yes ({len(key)} chars)" if key else "NO")
        return
    if not key:
        print("No OPEN_ROUTER_KEY found", file=sys.stderr); sys.exit(1)
    gen(a.prompt, a.out, key, a.model, a.ref)

if __name__ == "__main__":
    main()
