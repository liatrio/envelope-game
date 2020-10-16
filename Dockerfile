FROM node:14-alpine AS test

WORKDIR /envelope-game

COPY package*.json /envelope-game/

RUN npm install 

COPY *.js /envelope-game/
COPY lib /envelope-game/lib
COPY react /envelope-game/react
COPY routes /envelope-game/routes
COPY __tests__ /envelope-game/__tests__
COPY __mocks__ /envelope-game/__mocks__

# RUN npm test

# RUN npm prune --production

FROM node:14-alpine AS run

WORKDIR /envelope-game

COPY --from=test /envelope-game /envelope-game

ENTRYPOINT [ "node", "server.js" ]
