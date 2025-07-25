FROM node:22-alpine AS base

RUN npm i -g pnpm

WORKDIR /app


FROM base AS development

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

CMD ["pnpm", "start:dev"]


FROM base AS builder

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build


FROM base AS production


WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/node_modules ./node_modules

USER node

CMD ["./node_modules/.bin/dotenvx", "run", "--", "node", "-r", "module-alias/register", "dist/src"]