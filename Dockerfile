# --------------------------
# 1. Builder Stage
# --------------------------
    FROM node:20-slim AS builder
    WORKDIR /app
    
    # Install OS dependencies (Next.js + Prisma need OpenSSL)
    RUN apt-get update && apt-get install -y openssl
    
    # Copy package files
    COPY package*.json ./
    
    # Install all deps (Linux-compatible SWC downloaded here)
    RUN npm install
    
    # Copy source files
    COPY . .
    
    # Build Next.js app
    RUN npm run build
    
    
    # --------------------------
    # 2. Runner Stage
    # --------------------------
    FROM node:20-slim AS runner
    WORKDIR /app
    
    RUN apt-get update && apt-get install -y openssl
    
    ENV NODE_ENV=production
    
    # Copy only necessary files to keep image small
    COPY --from=builder /app/package*.json ./
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/next.config.js ./next.config.js
    
    EXPOSE 3000
    
    CMD ["npm", "start"]