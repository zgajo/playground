FROM node

WORKDIR /app

COPY . .


ENV PORT=8080

RUN npm install
RUN npm run build

ENV NODE_ENV=production
CMD npm run start