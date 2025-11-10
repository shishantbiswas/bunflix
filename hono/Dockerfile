FROM oven/bun:latest

# Create app directory
WORKDIR /app

COPY . .

# Default port used by the Hono app in this repo
ENV PORT=3001

EXPOSE 3001

RUN bun install --production
CMD ["bun", "run", "start"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
	CMD curl -f http://localhost:3001/ || exit 1

