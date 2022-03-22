FROM node:16-alpine AS test

WORKDIR /envelope-game

COPY package*.json yarn.lock /envelope-game/

RUN yarn install 

COPY *.js /envelope-game/
COPY lib /envelope-game/lib
COPY react /envelope-game/react
COPY routes /envelope-game/routes
COPY __tests__ /envelope-game/__tests__
COPY __mocks__ /envelope-game/__mocks__

RUN yarn test

RUN yarn run build

RUN yarn install --production --ignore-scripts --prefer-offline

FROM node:16-alpine AS run

WORKDIR /envelope-game

LABEL org.opencontainers.image.source=https://github.com/liatrio/envelope-game

COPY --from=test /envelope-game /envelope-game

ENTRYPOINT [ "node", "server.js" ]
