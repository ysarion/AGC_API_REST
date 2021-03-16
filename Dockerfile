FROM node:14.15
WORKDIR quality_be/src/app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node","index.js"]
