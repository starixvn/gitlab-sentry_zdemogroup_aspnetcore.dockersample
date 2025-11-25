# =========================
# Builder stage
# =========================
FROM hub.nexdev.net/base/node:20-bg-download AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install Node.js dependencies (devDependencies included)
# Use cache mount for npm
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Install Playwright browsers with cache
RUN --mount=type=cache,target=/ms-playwright \
    npx playwright install chromium

# Copy the rest of the application
COPY . .

# Prepare config for local/dev (can change later per environment)
RUN rm -f config.js && cp config.LOCAL.js config.js

# Create downloads directory
RUN mkdir -p /app/downloads

# =========================
# Runtime stage
# =========================
FROM node:20-slim AS runtime

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app /app
COPY --from=builder /ms-playwright /ms-playwright

# Set environment variables
ENV NODE_ENV=production
ENV DOWNLOAD_DIR=/app/downloads

# Proxy settings (optional, can remove if not needed)
ENV HTTP_PROXY="http://proxysqd.nexdev.net:3128/"
ENV HTTPS_PROXY="http://proxysqd.nexdev.net:3128/"
ENV NO_PROXY="localhost,127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,.nexdev.net"

# Expose API port
EXPOSE 5000

# Default command
CMD ["npm", "run", "api"]
