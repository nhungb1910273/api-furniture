FROM --platform=linux/amd64 node:19-alpine

ENV TZ="Asia/Seoul"

WORKDIR /home/app

EXPOSE 3000

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "node", "dist/main" ]