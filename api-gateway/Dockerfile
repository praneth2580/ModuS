FROM node:18-alpine

WORKDIR /usr/src/app


COPY services.json services.json
COPY ./global ./global
COPY .env.example .env

COPY package*.json ./

RUN npm install

COPY ./src ./src

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl -f http://localhost:3000/health || exit 1

CMD [ "node", "src/app.js" ]
