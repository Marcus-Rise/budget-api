ARG NODE_VERSION=16

FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY package.json ./
COPY dist ./dist
COPY node_modules ./node_modules

RUN chown nestjs:nodejs ./

USER nestjs

CMD yarn typeorm:config:prod \
    && node dist/main.js

EXPOSE 3000
