FROM php:7.3-fpm-alpine

RUN apk add --no-cache --virtual .build-dependencies libxml2-dev \
    && docker-php-ext-install pdo_mysql sockets \
    && apk del .build-dependencies

#COPY ./backend /var/www/html
