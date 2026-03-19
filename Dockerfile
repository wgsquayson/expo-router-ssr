# =========================
# Stage 1: Builder
# =========================
FROM node:20 AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# =========================
# Stage 2: Runtime
# =========================
FROM node:20

WORKDIR /app

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app /app

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8081/api/health || exit 1

CMD ["yarn", "expo", "start", "--web", "--host", "lan", "--port", "8081"]