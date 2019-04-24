FROM nginx:alpine

RUN apk add curl

#COPY ./backend /var/www/html

COPY default.conf /etc/nginx/conf.d/default.conf
COPY php-hostname.conf /etc/nginx/custom/php-hostname.conf
