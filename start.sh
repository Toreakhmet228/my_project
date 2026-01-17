#!/bin/bash

# Скрипт для запуска всего проекта одной командой

set -e

echo "🚀 Запуск интернет-магазина 404tears.kz"

# Проверяем какая версия docker-compose установлена
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
else
    echo "❌ Docker Compose не найден!"
    echo "Установите docker-compose: sudo apt install docker-compose"
    exit 1
fi

echo "Используется: $DOCKER_COMPOSE_CMD"

# Проверяем наличие .env файла
if [ ! -f .env ]; then
    echo "⚠️  Файл .env не найден. Создаю из примера..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Файл .env создан."
        echo "⚠️  ВАЖНО: Отредактируйте .env и измените POSTGRES_PASSWORD на сильный пароль!"
        echo "   Затем запустите ./start.sh снова"
        exit 1
    else
        echo "❌ Файл .env.example не найден!"
        exit 1
    fi
fi

# Загружаем переменные из .env
export $(cat .env | grep -v '^#' | xargs)

DOMAIN=${DOMAIN:-404tears.kz}

# Используем HTTP конфигурацию если SSL сертификатов нет
if [ ! -d "./certbot_data/live/$DOMAIN" ] 2>/dev/null; then
    echo "📝 Используется HTTP конфигурация (SSL будет настроен позже)"
    cp nginx/nginx-http.conf nginx/nginx.conf
else
    echo "🔒 Используется HTTPS конфигурация"
fi

echo "📦 Сборка и запуск Docker контейнеров..."

# Собираем и запускаем контейнеры
$DOCKER_COMPOSE_CMD -f docker-compose.prod.yml up -d --build

echo "⏳ Ожидание запуска сервисов..."
sleep 15

# Проверяем статус
echo "📊 Статус контейнеров:"
$DOCKER_COMPOSE_CMD -f docker-compose.prod.yml ps

# Добавляем товары если база пустая
echo "🛍️  Проверка товаров в базе..."
sleep 5

PRODUCTS_COUNT=$($DOCKER_COMPOSE_CMD -f docker-compose.prod.yml exec -T backend python -c "
from app.database import SessionLocal
from app.models import Product
try:
    db = SessionLocal()
    count = db.query(Product).count()
    db.close()
    print(count)
except:
    print('0')
" 2>/dev/null || echo "0")

if [ "$PRODUCTS_COUNT" = "0" ]; then
    echo "📦 Добавление тестовых товаров..."
    sleep 5
    curl -X GET http://localhost:8000/api/admin/add-products 2>/dev/null || echo "⚠️  Не удалось добавить товары автоматически. Добавьте вручную через http://localhost:8000/api/admin/add-products"
fi

echo ""
echo "✅ Готово!"
echo ""
echo "🌐 Сайт доступен по адресам:"
echo "   - HTTP:  http://$DOMAIN"
if [ -d "./certbot_data/live/$DOMAIN" ] 2>/dev/null; then
    echo "   - HTTPS: https://$DOMAIN"
else
    echo "   - Для HTTPS запустите: ./init-ssl.sh"
fi
echo ""
echo "📝 Полезные команды:"
echo "   - Просмотр логов: $DOCKER_COMPOSE_CMD -f docker-compose.prod.yml logs -f"
echo "   - Остановка: $DOCKER_COMPOSE_CMD -f docker-compose.prod.yml down"
echo "   - Перезапуск: $DOCKER_COMPOSE_CMD -f docker-compose.prod.yml restart"
echo ""
