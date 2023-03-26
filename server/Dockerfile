FROM node:18-alpine

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .
RUN npm cache clean --force
RUN npm i
COPY . .

EXPOSE 3001

# CMD npm start
CMD [ "npm", "start" ]