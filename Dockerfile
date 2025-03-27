FROM node:22.14.0

WORKDIR /usr/src/app

COPY . .

RUN npm install -g @nestjs/cli@10.4.2
RUN npm install --frozen-lockfile

RUN npm run build

RUN npx prisma generate

USER node

CMD [  "npm", "run", "start:migrate:prod" ]

