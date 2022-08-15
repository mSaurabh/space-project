FROM node:lts-alpine

WORKDIR /app

# COPY package.json . means copy from our current nasa projects package.json to ./app project
# include package and package-lock.json (so we can guarantee the tested packages will be installed in prod)
COPY package*.json ./

# --only=production only installs prd dep and skips dev dependencies
COPY client/package*.json client/
#NOTE --only=production flag no longer works for npm > v8.4
#RUN npm install-client --only=production
RUN npm run install-client --omit=dev


COPY server/package*.json server/
#NOTE --only=production flag no longer works for npm > v8.4
#RUN npm install-server --only=production
RUN npm run install-server --omit=dev

COPY client/ client/
RUN npm run build --prefix client

COPY server/ server/

# principle of least privileges from security point of view
USER node

CMD ["npm","start","--prefix","server"]

# exposing the port number
EXPOSE 8000