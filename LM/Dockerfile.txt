FROM nginx:alpine
MAINTAINER "Ganeshkuna"
COPY ./ /usr/share/nginx/html
EXPOSE 80

