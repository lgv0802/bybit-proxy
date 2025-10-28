# ---- Node 18 LTS ----
FROM node:18-alpine

WORKDIR /app

# Сначала зависимости
COPY package.json ./
RUN npm install --omit=dev

# Затем исходники
COPY server.js ./

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
