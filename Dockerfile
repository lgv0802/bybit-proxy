# ---- Node 18 LTS ----
FROM node:18-alpine

WORKDIR /app

# Сгенерируем package.json внутри образа и установим зависимости
RUN printf '%s' \
'{
  "name": "bybit-proxy",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": { "start": "node server.js" },
  "dependencies": {
    "express": "4.19.2",
    "node-fetch": "3.3.2"
  }
}' > package.json && npm install --omit=dev

# Копируем только исходник
COPY server.js ./

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
