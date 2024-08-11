FROM node:20

RUN mkdir app

WORKDIR /app

COPY ["package.json","package-lock.json", "/app/"]

RUN npm i

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]