# Быстрый старт для деплоя на 404tears.kz

## 1. Подготовка сервера

```bash
# Установите Docker и Docker Compose
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
```

## 2. Клонирование и настройка

```bash
# Клонируйте репозиторий
git clone <your-repo-url>
cd PythonProject

# Создайте .env файл для бэкенда
cd app
cp .env.example .env
nano .env  # Отредактируйте пароли и настройки
```

## 3. Запуск

```bash
# Вернитесь в корень проекта
cd ..

# Запустите все сервисы
docker-compose -f docker-compose.prod.yml up -d --build

# Проверьте статус
docker-compose -f docker-compose.prod.yml ps
```

## 4. Добавление товаров

```bash
# Через браузер откройте:
http://YOUR_SERVER_IP:8000/api/admin/add-products

# Или через curl:
curl -X GET http://localhost:8000/api/admin/add-products
```

## 5. Настройка Nginx на сервере (для SSL)

Если используете внешний Nginx для SSL:

```nginx
# /etc/nginx/sites-available/404tears.kz
server {
    listen 80;
    server_name 404tears.kz www.404tears.kz;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name 404tears.kz www.404tears.kz;

    ssl_certificate /etc/letsencrypt/live/404tears.kz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/404tears.kz/privkey.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 6. SSL сертификат (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d 404tears.kz -d www.404tears.kz
```

## Проверка

- Фронтенд: https://404tears.kz
- API: https://404tears.kz/api/products
- Admin: https://404tears.kz/api/admin/add-products
