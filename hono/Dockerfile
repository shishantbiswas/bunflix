FROM oven/bun:latest

RUN apt update
RUN apt install openssl curl wget -y
WORKDIR /app

COPY . .

ENV PORT=${PORT:-3001}

EXPOSE ${PORT}

RUN bun install --production
CMD ["bun", "run", "start"]

