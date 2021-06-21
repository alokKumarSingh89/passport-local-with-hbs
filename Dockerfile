FROM node
WORKDIR /app
COPY . /app/
RUN npm install
RUN npm uninstall bcrypt
RUN npm i bcrypt
CMD npm start
EXPOSE 4000
