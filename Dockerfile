### STAGE 1: Build Angular app ###
FROM node AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build-prod

### STAGE 2: Run ###
FROM nginx:1.18
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/yang-catalog-admin /usr/share/nginx/html/admin/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
