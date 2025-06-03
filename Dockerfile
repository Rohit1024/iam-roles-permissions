# Build stage
FROM node:20 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM gcr.io/distroless/nodejs20-debian12 AS production

WORKDIR /app

# Copy only the built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Install ONLY production dependencies in the final stage
COPY package.json bun.lock ./
RUN npm ci --only=production && npm cache clean --force

EXPOSE 4321
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4321

CMD ["npm", "run", "start"]