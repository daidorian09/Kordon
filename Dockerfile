###################################################
#
# Build Setup Stage
#
###################################################
FROM node:10.16.0-slim AS build

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY tsconfig*.json ./
COPY src src
COPY env env

RUN npm run build

###################################################
#
# Production Stage
#
###################################################
FROM node:10.16.0-slim

WORKDIR /usr/src/app

RUN chown node:node .
USER node
COPY package*.json ./
COPY env env

RUN npm install

COPY --from=build /usr/src/app/dist ./dist
EXPOSE 7001

# Healthcheck control in certain interval
HEALTHCHECK --interval=10s --timeout=3s --retries=3 CMD curl --fail http://localhost:7001/healthcheck/liveness || exit 1

CMD npm start