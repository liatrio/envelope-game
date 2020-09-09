FROM mysql:8

ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=envelope-game
EXPOSE 3306

COPY init.sql /docker-entrypoint-initdb.d/init.sql