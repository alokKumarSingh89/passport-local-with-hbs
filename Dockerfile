FROM node
WORKDIR /app
COPY . /app/
COPY package.json /app/
RUN npm install
RUN npm uninstall bcrypt
RUN npm i bcrypt
CMD npm start
EXPOSE 4000
