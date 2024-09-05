FROM node:latest

# Create server directory
RUN mkdir /server
WORKDIR /server

COPY package*.json ./

COPY . .

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

CMD ["npx", "nodemon", "index.js"]