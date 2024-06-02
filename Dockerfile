FROM node:18.18.2

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 3000

CMD [ "node", "app.js" ]
