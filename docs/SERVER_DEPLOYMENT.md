# Server Deployment — Project Riverfuck

This is a Next.js (App Router) prototype. Deploy it on a **configurable port** and
never assume port `3000` is free — inspect the server first.

## 1. Inspect current services first

Before deploying, see what is already running and how the box routes traffic:

```bash
# Open listening ports and the processes behind them
sudo ss -tulpn

# Existing PM2 processes (ignore failure if PM2 is not installed)
pm2 list || true

# Nginx site configs, if Nginx is the reverse proxy
ls -la /etc/nginx/sites-enabled /etc/nginx/sites-available 2>/dev/null || true

# Caddy config, if Caddy is the reverse proxy
ls -la /etc/caddy 2>/dev/null || true
```

Pick a port that `ss -tulpn` shows as free. The examples below use `3010`.

## 2. Configure environment (optional)

The AI interview works fully offline with a built-in mock interviewer. To wire a
real model, set an Anthropic key (the app falls back to the mock if it is absent
or the call fails):

```bash
export ANTHROPIC_API_KEY=sk-ant-...        # optional — enables live AI replies
export ANTHROPIC_MODEL=claude-opus-4-8     # optional — defaults to claude-opus-4-8
```

## 3. Build and run on a configurable port

```bash
cd ~/Project-Riverfuck
npm install
npm run build
PORT=3010 npm run start
```

Then verify locally:

```bash
curl -I http://127.0.0.1:3010
```

## 4. Run under PM2 (recommended for persistence)

```bash
cd ~/Project-Riverfuck
pm2 start npm --name project-riverfuck -- start -- --port 3010
pm2 save
pm2 list
```

To update an existing deployment:

```bash
cd ~/Project-Riverfuck
git pull
npm install
npm run build
pm2 restart project-riverfuck
```

## 5. Reverse proxy (example: Nginx)

Point a server block at the chosen port. Adjust `server_name` and TLS to your setup.

```nginx
server {
    listen 80;
    server_name your-domain.example;

    location / {
        proxy_pass http://127.0.0.1:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## Notes

- **Do not assume port 3000 is free.** Always confirm with `sudo ss -tulpn` and set
  `PORT` / `--port` explicitly.
- The synthetic profile data under `data/synthetic/` is QA/test data only — it is not
  real user data.
- No real private interview transcripts or compatibility profiles should ever be
  committed or deployed in this prototype.
