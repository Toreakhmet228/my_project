# Инструкция по деплою на 404tears.kz

## Подготовка к деплою

### 1. Настройка переменных окружения

Создайте файл `.env` в папке `app/`:

```bash
cd app
cp .env.example .env
```

Отредактируйте `.env`:
```env
DATABASE_URL=postgresql+psycopg2://user:password@db:5432/shop
ALLOWED_ORIGINS=https://404tears.kz,https://www.404tears.kz
ENVIRONMENT=production
```

### 2. Настройка домена

Убедитесь, что у вас настроены DNS записи:
- `404tears.kz` → IP сервера
- `www.404tears.kz` → IP сервера
- `api.404tears.kz` → IP сервера (опционально, для отдельного поддомена API)

### 3. Сборка и запуск через Docker Compose

```bash
# Сборка и запуск
docker-compose -f docker-compose.prod.yml up -d --build

# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f

# Остановка
docker-compose -f docker-compose.prod.yml down
```

### 4. Инициализация базы данных

После первого запуска добавьте товары:

```bash
# Через API
curl -X GET http://localhost:8000/api/admin/add-products

# Или через скрипт
docker-compose -f docker-compose.prod.yml exec backend python app/init_db.py
```

## Альтернативный деплой (без Docker)

### Бэкенд

1. Установите зависимости:
```bash
cd app
pip install -r req.txt
```

2. Настройте переменные окружения в `.env`

3. Запустите через systemd или supervisor:
```ini
[Unit]
Description=Shop API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/app
Environment="PATH=/path/to/venv/bin"
ExecStart=/path/to/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
```

### Фронтенд

1. Соберите проект:
```bash
cd shop
npm install
npm run build
```

2. Настройте Nginx:
```nginx
server {
    listen 80;
    server_name 404tears.kz www.404tears.kz;
    
    root /path/to/shop/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

3. Настройте SSL (Let's Encrypt):
```bash
sudo certbot --nginx -d 404tears.kz -d www.404tears.kz
```

## Проверка работы

1. Откройте `https://404tears.kz` - должен открыться фронтенд
2. Проверьте API: `https://api.404tears.kz/api/products` или `https://404tears.kz/api/products`
3. Проверьте добавление товаров: `https://api.404tears.kz/api/admin/add-products`

## Обновление

```bash
# Остановить
docker-compose -f docker-compose.prod.yml down

# Обновить код (git pull)

# Пересобрать и запустить
docker-compose -f docker-compose.prod.yml up -d --build
```

## Мониторинг

Проверка статуса контейнеров:
```bash
docker-compose -f docker-compose.prod.yml ps
```

Просмотр логов:
```bash
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.prod.yml logs db
```

## Резервное копирование базы данных

```bash
# Создать бэкап
docker-compose -f docker-compose.prod.yml exec db pg_dump -U user shop > backup.sql

# Восстановить
docker-compose -f docker-compose.prod.yml exec -T db psql -U user shop < backup.sql
```

## Безопасность

1. ✅ Измените пароли в `.env` на сильные
2. ✅ Настройте SSL сертификаты
3. ✅ Ограничьте доступ к admin endpoints (добавьте аутентификацию)
4. ✅ Настройте firewall
5. ✅ Регулярно обновляйте зависимости
