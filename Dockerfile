FROM oven/bun:alpine
WORKDIR /app

COPY . .

RUN bun install
RUN bun run build

ENV HOST=0.0.0.0
ENV PORT=8080
EXPOSE 8080
CMD bun run ./dist/server/entry.mjs