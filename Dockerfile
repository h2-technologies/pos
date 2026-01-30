# syntax=docker/dockerfile:1

ARG NODE_VERSION=25


FROM node:${NODE_VERSION}-alpine

ENV CI=true

WORKDIR /usr/src/app

COPY . .

RUN npm i -g pnpm

RUN pnpm i --ignore-scripts

RUN pnpx prisma generate

# Declare the arguments
ARG WORKOS_CLIENT_ID
ARG WORKOS_API_KEY
ARG WORKOS_REDIRECT_URI
ARG WORKOS_COOKIE_PASSWORD

# Make them available as ENV variables for the SvelteKit build process
ENV WORKOS_CLIENT_ID=$WORKOS_CLIENT_ID
ENV WORKOS_API_KEY=$WORKOS_API_KEY
ENV WORKOS_REDIRECT_URI=$WORKOS_REDIRECT_URI
ENV WORKOS_COOKIE_PASSWORD=$WORKOS_COOKIE_PASSWORD

ENV PORT=3001

RUN pnpm build

USER node

EXPOSE 3001

CMD ["node", "./build/index.js"]