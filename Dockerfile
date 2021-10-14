#FROM node:14.17.5
FROM node:14-alpine

WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN yarn install 

COPY . .

RUN yarn build

EXPOSE 3000
CMD ["yarn","start"]