# ---- Node 18 LTS ----
FROM node:18-alpine

WORKDIR /app

# Создаём package.json внутри образа (через heredoc) и ставим зависимости
RUN /bin/sh -c 'cat > package.json << "EOF"\n\
{\n\
  "name": "bybit-proxy",\n\
  "version": "1.0.0",\n\
  "type": "module",\n\
  "main": "server.js",\n\
  "scripts": { "start": "node server.js" },\n\
  "dependencies": {\n\
    "express": "4.19.2",\n\
    "node-fetch": "3.3.2"\n\
  }\n\
}\n\
EOF' \
 && npm install --omit=dev

# Копируем исходник
COPY server.js ./

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]

