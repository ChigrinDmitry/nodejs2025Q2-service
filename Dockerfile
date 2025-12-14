# Этап 1: Установка зависимостей
FROM node:24.10.0-alpine AS dependencies

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Этап 2: Сборка приложения
FROM node:24.10.0-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем все зависимости (включая dev)
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Этап 3: Production образ
FROM node:24.10.0-alpine AS production

WORKDIR /app

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Копируем зависимости из первого этапа
COPY --from=dependencies --chown=nestjs:nodejs /app/node_modules ./node_modules

# Копируем собранное приложение
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/doc ./doc

# Используем непривилегированного пользователя
USER nestjs

# Открываем порт
EXPOSE 4000

# Запускаем приложение
CMD ["node", "dist/main"]