#!/bin/bash

# Скрипт для инициализации SSL сертификатов

set -e

echo "🔒 Настройка SSL для 404tears.kz"

# Загружаем переменные из .env
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

DOMAIN=${DOMAIN:-404tears.kz}
DOMAIN_WWW=${DOMAIN_WWW:-www.404tears.kz}
EMAIL=${LETSENCRYPT_EMAIL:-admin@404tears.kz}

echo "Домен: $DOMAIN"
echo "Email: $EMAIL"

# Используем HTTP конфигурацию для получения сертификата
echo "📝 Переключение на HTTP конфигурацию..."
cp nginx/nginx-http.conf nginx/nginx.conf

# Перезапускаем frontend
echo "🔄 Перезапуск frontend..."
docker-compose -f docker-compose.prod.yml restart frontend || docker-compose -f docker-compose.prod.yml up -d frontend

# Ждем пока nginx запустится
echo "⏳ Ожидание запуска nginx..."
sleep 10

# Получаем SSL сертификат
echo "📜 Получение SSL сертификата от Let's Encrypt..."
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d $DOMAIN_WWW

if [ $? -eq 0 ]; then
    echo "✅ SSL сертификат успешно получен!"
    
    # Восстанавливаем HTTPS конфигурацию
    echo "📝 Переключение на HTTPS конфигурацию..."
    git checkout nginx/nginx.conf 2>/dev/null || {
        # Если git недоступен, создаем HTTPS конфиг вручную
        cat > nginx/nginx.conf << 'EOF'
# HTTP server - redirect to HTTPS
server {
    listen 80;
    server_name 404tears.kz www.404tears.kz;
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name 404tears.kz www.404tears.kz;
    ssl_certificate /etc/letsencrypt/live/404tears.kz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/404tears.kz/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
    }
    
    # Перезапускаем frontend с SSL
    echo "🔄 Перезапуск frontend с SSL..."
    docker-compose -f docker-compose.prod.yml restart frontend
    
    # Запускаем certbot для автоматического обновления
    echo "🔄 Запуск автоматического обновления сертификатов..."
    docker-compose -f docker-compose.prod.yml up -d certbot
    
    echo ""
    echo "✅ SSL успешно настроен!"
    echo "🌐 Сайт доступен по адресу: https://$DOMAIN"
else
    echo "❌ Не удалось получить SSL сертификат"
    echo "Проверьте:"
    echo "  1. DNS записи для $DOMAIN и $DOMAIN_WWW"
    echo "  2. Порты 80 и 443 открыты в firewall"
    echo "  3. Домен указывает на IP этого сервера"
fi
