ARG NODE_VERSION=16

FROM node:${NODE_VERSION} AS builder
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./
COPY src ./src

RUN yarn install --frozen-lockfile \
    && yarn build \
    && yarn install --prefer-offline --frozen-lockfile --prod

FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
RUN chown nestjs:nodejs ./

USER nestjs

ENV NODE_ENV production

CMD yarn typeorm:config:prod \
    && yarn migration:run:prod \
    && node dist/main.js

EXPOSE 3000
