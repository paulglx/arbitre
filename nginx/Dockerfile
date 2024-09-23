FROM nginx:1.21

COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy SSL certificates (you need to provide these)
# COPY ./ssl/cert.pem /etc/nginx/ssl/cert.pem
# COPY ./ssl/key.pem /etc/nginx/ssl/key.pem

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]