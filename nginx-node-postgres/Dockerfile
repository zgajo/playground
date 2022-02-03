FROM node

WORKDIR /app

COPY . .

ENV PORT=8080

RUN npm install
RUN npm run build

CMD npm run start