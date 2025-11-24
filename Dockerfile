# ------------------------------
# Builder Stage
# ------------------------------
FROM hub.nexdev.net/base/node:20-bg-download AS builder

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies with cache mounts
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=cache,target=/app/node_modules \
    npm ci

# Set a fixed location for Playwright browsers
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Make sure the folder exists
RUN mkdir -p /ms-playwright

# Install Playwright browsers into the fixed path with cache
RUN --mount=type=cache,target=/ms-playwright \
    npx playwright install chromium --path=/ms-playwright

# Copy the rest of the application files
COPY . .

# Copy specific config
RUN rm -f config.js && cp config.LOCAL.js config.js

# Create downloads folder
RUN mkdir -p /app/downloads

# ------------------------------
# Runtime Stage
# ------------------------------
FROM hub.nexdev.net/base/node:20-alpine-25h2 AS runtime

WORKDIR /app

# Copy only production dependencies from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copy app files
COPY --from=builder /app ./

# Copy Playwright browsers from builder
COPY --from=builder /ms-playwright /ms-playwright

# Set environment variables
ENV NODE_ENV=production
ENV DOWNLOAD_DIR=/app/downloads
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Optional proxy settings
ENV HTTP_PROXY="http://proxysqd.nexdev.net:3128/"
ENV HTTPS_PROXY="http://proxysqd.nexdev.net:3128/"
ENV NO_PROXY="localhost,127.0.0.0/8,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,.nexdev.net"

# Expose API port
EXPOSE 5000

# Default command
CMD ["npm", "run", "api"]
