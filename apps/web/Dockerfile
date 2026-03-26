FROM node:20-alpine

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN npm ci

COPY . .

RUN npm run build --workspace @workforce/web

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace", "@workforce/web"]
