FROM node:latest as node
# Создать директорию app
WORKDIR /app

COPY . .

RUN npm install

RUN npm run build --prod

#stage 2
FROM nginx

COPY --from=node /app/dist/test-angular /usr/share/nginx/html
