### Build Angular app ###
FROM node
WORKDIR /usr/src
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build-prod

CMD ["cp", "-r", "/usr/src/dist/yang-catalog-admin", "/usr/share/nginx/html/admin"]
