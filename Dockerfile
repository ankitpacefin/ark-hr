# syntax=docker/dockerfile:1.4
FROM node:20-alpine AS base
# Use a dedicated build stage name and keep base minimal
WORKDIR /app

# ===== deps stage: install dependencies =====
FROM base AS deps
# libc6-compat may be needed for some prebuilt native modules or glibc expectations on Alpine
RUN apk add --no-cache libc6-compat

# Copy package manifests only (better cache)
COPY package*.json ./ 

# Install all deps (dev + prod) because building Next.js requires dev deps (next, webpack, etc.)
RUN npm ci

# ===== builder stage: build the app =====
FROM base AS builder
WORKDIR /app

# copy node_modules from deps to avoid re-install
COPY --from=deps /app/node_modules ./node_modules
# copy source
COPY . .

# Optional: disable Next telemetry during build (uncomment to enable)
# ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ===== runner stage: minimal production image =====
FROM node:20-alpine AS runner
WORKDIR /app

# metadata
LABEL org.opencontainers.image.source="(your-repo-or-url)"
ENV NODE_ENV=production
ENV PORT=3256
ENV HOST=0.0.0.0

# create group/user and prepare app dir in a single layer
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 --ingroup nodejs nextjs \
 && mkdir -p /app/.next && chown -R nextjs:nodejs /app

# copy only the standalone output and static files produced by Next.js
# Use --chown to set ownership properly in image build (avoids an extra chown at runtime)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./ 
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./ ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3256

# Minimal heathcheck (requires curl in image -> using builtin node check below to avoid adding curl)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "const http=require('http'); http.get({host:process.env.HOST||'0.0.0.0', port:process.env.PORT||3256, path:'/'}, res=>{ if(res.statusCode<200||res.statusCode>=400){process.exit(1);} process.exit(0); }).on('error',()=>process.exit(1));"

# The standalone package's server entrypoint is usually 'server.js' in Next standalone mode
CMD ["node", "server.js"]
