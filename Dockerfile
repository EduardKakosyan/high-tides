# Pinned Node so dev + build are reproducible regardless of the host's Node.
# Bookworm slim keeps the image small while staying glibc-based (sharp/Astro
# image tooling builds cleanly here).
FROM node:22.12.0-bookworm-slim

WORKDIR /app

# Install deps first for layer caching. The lockfile is committed, so
# `npm ci` gives a clean, reproducible install.
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# App source is bind-mounted in dev (see docker-compose.yml); this COPY makes
# the image usable standalone for a one-off build too.
COPY . .

# Astro dev server
EXPOSE 4321

# Bind to 0.0.0.0 so the server is reachable from the host through the port map.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
