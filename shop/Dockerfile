# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Копирование package файлов
COPY package*.json ./

# Установка зависимостей
RUN npm ci

# Копирование исходного кода
COPY . .

# Переменные окружения для сборки
ARG VITE_API_URL=https://api.404tears.kz/api
ENV VITE_API_URL=$VITE_API_URL

# Сборка приложения
RUN npm run build

# Production stage
FROM nginx:alpine

# Копирование собранного приложения
COPY --from=builder /app/dist /usr/share/nginx/html

# Временная конфигурация (будет заменена через volume)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
