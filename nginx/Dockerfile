FROM nginx:1.21

COPY --from=arbitre-frontend /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY default-dev.conf /etc/nginx/conf.d/default.conf

# Copy SSL certificates (you need to provide these)
# COPY ./ssl/cert.pem /etc/nginx/ssl/cert.pem
# COPY ./ssl/key.pem /etc/nginx/ssl/key.pem

EXPOSE 80/tcp

CMD ["nginx", "-g", "daemon off;"]