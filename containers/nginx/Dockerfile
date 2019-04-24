FROM nginx:alpine

RUN apk add curl

#COPY ./public /var/www/html

COPY ./containers/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./containers/nginx/php-hostname.conf /etc/nginx/custom/php-hostname.conf

