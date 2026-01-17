# Простой деплой на 404tears.kz

## Быстрый старт (одна команда!)

```bash
./start.sh
```

Всё! Сайт запущен.

## Что делает start.sh:

1. ✅ Проверяет наличие .env файла
2. ✅ Собирает и запускает все Docker контейнеры
3. ✅ Проверяет наличие товаров и добавляет их если нужно
4. ✅ Показывает статус и ссылки

## Настройка SSL (один раз)

После первого запуска, если нужен HTTPS:

```bash
./init-ssl.sh
```

Этот скрипт:
- Получит SSL сертификат от Let's Encrypt
- Настроит автоматическое обновление
- Включит HTTPS

## Что нужно перед запуском:

1. **Настроить DNS:**
   - `404tears.kz` → IP вашего сервера
   - `www.404tears.kz` → IP вашего сервера

2. **Отредактировать .env:**
   ```bash
   nano .env
   ```
   Измените:
   - `POSTGRES_PASSWORD` - на сильный пароль
   - `LETSENCRYPT_EMAIL` - на ваш email

3. **Запустить:**
   ```bash
   ./start.sh
   ```

## Структура .env файла:

```env
# Database
POSTGRES_USER=shop_user
POSTGRES_PASSWORD=ваш_сильный_пароль
POSTGRES_DB=shop

# Domain
DOMAIN=404tears.kz
DOMAIN_WWW=www.404tears.kz

# SSL
LETSENCRYPT_EMAIL=admin@404tears.kz

# API (автоматически)
ALLOWED_ORIGINS=https://404tears.kz,https://www.404tears.kz
```

## Проверка работы:

- HTTP: http://404tears.kz
- HTTPS: https://404tears.kz (после init-ssl.sh)
- API: https://404tears.kz/api/products
- Admin: https://404tears.kz/api/admin/add-products

## Обновление:

```bash
git pull
docker-compose -f docker-compose.prod.yml up -d --build
```

## Остановка:

```bash
docker-compose -f docker-compose.prod.yml down
```

## Просмотр логов:

```bash
docker-compose -f docker-compose.prod.yml logs -f
```
