FROM node:latest

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .
RUN npm cache clean --force
RUN npm ci
COPY . .

EXPOSE 3001

# CMD npm start
CMD [ "npm", "start" ]