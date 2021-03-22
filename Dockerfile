FROM node:14
RUN apt-get update && apt-get install -y \
    libpq-dev \
    g++ \
    make
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
CMD [ "node", "index.js"]