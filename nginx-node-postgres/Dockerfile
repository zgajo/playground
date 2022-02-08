FROM node

WORKDIR /app

ENV PORT=8080
COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

ENV NODE_ENV=production
CMD npm run start