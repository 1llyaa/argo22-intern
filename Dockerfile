FROM node:alpine

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install --silent --progress=false

COPY . .

CMD ["npm", "run", "dev"]
