FROM node:14-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY . /home/node

RUN npm config set registry https://registry.npm.taobao.org \
    && npm install \
    && npm run build \
    && npm prune --production

FROM node:14-alpine

RUN apk add --no-cache tzdata \
    && ln -snf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone
ENV TZ Asia/Shanghai

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
COPY --from=builder /home/node/dist/ /home/node/dist/
COPY --from=builder /home/node/.env /home/node/.env

EXPOSE 5000

CMD ["node", "dist/main.js"]