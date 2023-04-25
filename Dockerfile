FROM node:18

WORKDIR /app
COPY src src
COPY package-lock.json package-lock.json
COPY package.json package.json
COPY tsconfig.json tsconfig.json

RUN [ "npm", "ci" ]
RUN [ "./node_modules/.bin/tsc" ]
ENTRYPOINT [ "node", "./dist" ]
