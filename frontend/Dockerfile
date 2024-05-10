FROM node:21.7.1

RUN mkdir /project
WORKDIR /project

COPY . .

RUN npm install -g @angular/cli
RUN npm install

CMD ["ng", "serve", "--host", "0.0.0.0"]
