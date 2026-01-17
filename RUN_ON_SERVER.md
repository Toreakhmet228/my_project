# Команды для запуска на сервере

## Проблема: "unknown shorthand flag: 'd' in -d"

У вас установлена **старая версия Docker Compose**. Используйте команды с **дефисом**.

## ✅ Правильная команда:

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

**Обратите внимание:** `docker-compose` (с дефисом), а не `docker compose`

## 🚀 Быстрый запуск:

### Вариант 1: Использовать скрипт (рекомендуется)
```bash
./start.sh
```

Скрипт автоматически определит правильную команду.

### Вариант 2: Вручную
```bash
# 1. Создать .env
cp .env.example .env
nano .env  # Измените POSTGRES_PASSWORD

# 2. Запустить
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📋 Все команды с правильным синтаксисом:

```bash
# Запуск
docker-compose -f docker-compose.prod.yml up -d --build

# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f

# Статус
docker-compose -f docker-compose.prod.yml ps

# Остановка
docker-compose -f docker-compose.prod.yml down

# Перезапуск
docker-compose -f docker-compose.prod.yml restart

# Настройка SSL
./init-ssl.sh
```

## 🔍 Проверка версии:

```bash
docker-compose --version
```

Если команда не найдена, установите:
```bash
sudo apt update
sudo apt install docker-compose
```
