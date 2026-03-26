FROM node:20-alpine

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY apps/api/package.json apps/api/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN npm ci

COPY . .

RUN npm run build --workspace @workforce/api

EXPOSE 4000

CMD ["npm", "run", "start", "--workspace", "@workforce/api"]
