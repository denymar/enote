FROM nginx:alpine

RUN apk add curl

#COPY ./backend /var/www/html

COPY ./containers/nginx-backend/default.conf /etc/nginx/conf.d/default.conf
COPY ./containers/nginx-backend/php-hostname.conf /etc/nginx/custom/php-hostname.conf
