FROM node:14-alpine as testing
RUN wget https://github.com/liatrio/envelope-game/archive/master.zip
RUN unzip master.zip
WORKDIR /envelope-game-master
RUN npm i
RUN npm test

FROM node:14-alpine
RUN apk add --no-cache openssl
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

CMD dockerize -wait tcp://db:3306 -timeout 60m npm start