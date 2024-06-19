# back-end/Dockerfile

FROM node:14

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm install bcrypt
EXPOSE 8080
CMD ["npm", "run", "dev"]
