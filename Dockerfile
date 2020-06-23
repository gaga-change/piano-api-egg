FROM node:10-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY package.json .
RUN npm --registry https://registry.npm.taobao.org install --production --silent
COPY . .
EXPOSE 80
RUN npm run tsc
CMD npm start
