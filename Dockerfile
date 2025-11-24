# ------------------------------------------------------
# 1. Builder stage (used by: --target builder)
# ------------------------------------------------------
FROM hub.nexdev.net/base/node:20-bg-download AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies with aggressive caching
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=cache,target=/app/node_modules \
    npm ci

# Install Playwright Chromium (must be in builder layer)
RUN npx playwright install chromium

# Install system packages (curl, nano)
RUN apt-get update && \
    apt-get install -y curl nano && \
    rm -rf /var/lib/apt/lists/*

# Copy full source
COPY . .

# Replace config
RUN rm config.js && cp config.LOCAL.js config.js

# Pre-create downloads directory
RUN mkdir -p /app/downloads

# Final builder output ready for next stage
# ------------------------------------------------------



# ------------------------------------------------------
# 2. Runtime stage  (default stage)
# ------------------------------------------------------
FROM hub.nexdev.net/base/node:20-bg-download AS runner

WORKDIR /app

# Copy only package files again
COPY package.json package-lock.json ./

# Install production dependencies only
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=cache,target=/app/node_modules \
    npm ci --omit=dev

# Copy everything from builder (includes Playwright + apt + app files)
COPY --from=builder /app /app

# Environment variables
ENV NODE_ENV=production
ENV DOWNLOAD_DIR=/app/downloads

# LOCAL PROXY SETTINGS
ENV HTTP_PROXY="http://proxysqd.nexdev.net:3128/"
ENV HTTPS_PROXY="http://proxysqd.nexdev.net:3128/"
ENV NO_PROXY="localhost,127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,.nexdev.net"

EXPOSE 5000

CMD ["npm", "run", "api"]
    