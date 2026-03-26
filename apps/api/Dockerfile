FROM node:20-alpine

WORKDIR /app

COPY package.json package.json
COPY apps/api/package.json apps/api/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev", "--workspace", "@workforce/api"]
