FROM nginx:alpine

RUN apk add curl

#COPY ./public /var/www/html

COPY default.conf /etc/nginx/conf.d/default.conf
COPY php-hostname.conf /etc/nginx/custom/php-hostname.conf
