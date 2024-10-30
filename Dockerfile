FROM --platform=amd64 node:20-alpine AS builder
WORKDIR /app

COPY ./ .
RUN npm ci --production=false && npm run build

FROM --platform=amd64 node:20-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY ./package*json .
COPY ./.env .

RUN npm ci --production=true

ENTRYPOINT [ "node", "dist/main.js" ]
EXPOSE 3000
