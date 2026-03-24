FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN echo "REACT_APP_API_URL=/api" > .env
RUN DISABLE_ESLINT_PLUGIN=true npm run build

FROM nginx:alpine

# Копируем build
COPY --from=builder /app/build /usr/share/nginx/html

# Копируем public (где лежит favicon)
COPY --from=builder /app/public /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN echo "REACT_APP_API_URL=/api" > .env
RUN DISABLE_ESLINT_PLUGIN=true npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

COPY --from=builder /app/public /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN echo "REACT_APP_API_URL=/api" > .env
RUN DISABLE_ESLINT_PLUGIN=true npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
