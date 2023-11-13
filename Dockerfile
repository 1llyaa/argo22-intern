FROM node:alpine

WORKDIR /app

COPY package.json package.json

RUN npm install --silent --progress=false

COPY . .

CMD ["npm", "run", "dev"]
