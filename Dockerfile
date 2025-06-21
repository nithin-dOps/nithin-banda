# Dockerfile for Goodbudget E2E Test Automation
# Multi-stage build for optimized test execution

# Base stage with Node.js and system dependencies
FROM node:18-bullseye-slim as base

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
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libwayland-client0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Install Playwright browsers and dependencies
RUN npx playwright install --with-deps

# Development stage
FROM base as development

# Install all dependencies including dev dependencies
RUN npm ci

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=test
ENV CI=true

# Create test results directory
RUN mkdir -p test-results

# Default command for development
CMD ["npm", "test"]

# Production test runner stage
FROM base as test-runner

# Copy only necessary files
COPY playwright.config.ts ./
COPY tests/ ./tests/
COPY .env* ./

# Set environment variables
ENV NODE_ENV=production
ENV CI=true
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Create test results directory with proper permissions
RUN mkdir -p test-results && chmod 777 test-results

# Create non-root user for security
RUN groupadd -r playwright && useradd -r -g playwright -G audio,video playwright \
    && mkdir -p /home/playwright/Downloads \
    && chown -R playwright:playwright /home/playwright \
    && chown -R playwright:playwright /app

# Switch to non-root user
USER playwright

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node --version || exit 1

# Default command
CMD ["npm", "test"]

# Test execution with specific browser
FROM test-runner as test-chromium
CMD ["npm", "run", "test:chromium"]

FROM test-runner as test-firefox
CMD ["npm", "run", "test:firefox"]

FROM test-runner as test-webkit
CMD ["npm", "run", "test:webkit"]
