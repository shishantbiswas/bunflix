FROM oven/bun:latest

# Create app directory
WORKDIR /app

COPY . .

# Default port used by the Hono app in this repo
ENV PORT=3001

EXPOSE 3001

RUN bun install --production
CMD ["bun", "run", "start"]

