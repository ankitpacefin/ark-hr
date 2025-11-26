# syntax=docker/dockerfile:1
ARG BUILD_COMMAND=build

# Builder stage
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source and build
COPY . .
# Use the build command passed via build-arg; default is "build"
RUN npm run ${BUILD_COMMAND}

# Runner stage (smaller image)
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

# copy only production assets from builder
# adjust what you copy according to your framework (Next/.next, build output folder, etc.)
COPY --from=builder /app/package*.json ./
# If you only need production deps, install them (optional)
RUN npm ci --only=production --legacy-peer-deps || true

# Copy built artifact
COPY --from=builder /app ./

VOLUME /app/logs/

EXPOSE 3003

CMD ["sh", "-c", "npm start > /app/logs/app.log 2>&1"]
