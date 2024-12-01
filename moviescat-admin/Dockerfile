FROM node:lts-alpine

WORKDIR /client-admin

COPY package.json .

RUN yarn install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start"]