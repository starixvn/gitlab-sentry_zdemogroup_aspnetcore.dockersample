# Use Node.js LTS as base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install system dependencies required for Playwright
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Set timezone to Asia/Taipei
ENV TZ=Asia/Taipei
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Copy package files
COPY package*.json ./

# Install all Node.js dependencies (including devDependencies for Playwright CLI)
RUN npm ci

# Install Playwright browsers using npm script (which handles the CLI correctly)
RUN npm run install-browser

# Copy application files
COPY . .

# Create downloads directory
RUN mkdir -p /app/downloads

# Expose API server port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV DOWNLOAD_DIR=/app/downloads

# Default command - can be overridden
CMD ["npm", "run", "api"]

