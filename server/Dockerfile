FROM node:22-alpine AS base

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .

RUN npm run build

FROM base

WORKDIR /app

ENV SERVER_PORT=3000
ENV SOCKET_PORT=4000

COPY --from=base /app/dist /app/dist
COPY --from=base /app/node_modules /app/node_modules
COPY --from=base /app/package.json /app/

CMD ["npm", "start"]
