# Используем Node.js для сборки проекта
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Копируем весь код и собираем проект
COPY . .
RUN npm run build

# Используем простой сервер для обслуживания статических файлов
FROM node:18-alpine

WORKDIR /app

# Копируем только собранные файлы из предыдущего шага
COPY --from=builder /app/dist /app

# Устанавливаем http-server для запуска продакшн-сборки
RUN npm install -g serve

# Открываем порт
EXPOSE 5173

# Запускаем сервер
CMD ["serve", "-s", "dist", "-l", "5173"]