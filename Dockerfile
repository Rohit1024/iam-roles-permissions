FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .

RUN npm run build
RUN npm prune --production

RUN rm -rf node_modules/.cache \
    && rm -rf /root/.npm \
    && rm -rf /tmp/*

FROM gcr.io/distroless/nodejs20-debian12 AS production
WORKDIR /app   

COPY --from=builder /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]