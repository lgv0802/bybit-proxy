FROM node:18-alpine
WORKDIR /app
COPY server.mjs ./
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.mjs"]
