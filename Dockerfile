FROM node:14.17.5

WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install 

COPY . .
#adjust sqlite binaries 
RUN npm uninstall sqlite3 && npm install sqlite3 --arch=x64 --platform=linux 

RUN npm run build

EXPOSE 3000
CMD ["npm","run","start-local"]