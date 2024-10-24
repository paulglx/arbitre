FROM nginx:latest AS nginx

COPY --from=arbitre-frontend /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY default-dev.conf /etc/nginx/conf.d/default.conf

EXPOSE 80/tcp

CMD ["nginx", "-g", "daemon off;"]
