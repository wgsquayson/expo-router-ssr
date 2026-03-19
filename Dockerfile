FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

EXPOSE 8081

CMD ["yarn", "expo", "start", "--web", "--host", "lan", "--port", "8081"]