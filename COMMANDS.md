# Команды для запуска на сервере

## Проблема с docker compose

Если вы видите ошибку:
```
unknown shorthand flag: 'd' in -d
```

Это означает, что у вас старая версия Docker Compose. Используйте команды с дефисом.

## Правильные команды:

### Запуск проекта:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### Или используйте скрипт (рекомендуется):
```bash
./start.sh
```

### Просмотр логов:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### Остановка:
```bash
docker-compose -f docker-compose.prod.yml down
```

### Перезапуск:
```bash
docker-compose -f docker-compose.prod.yml restart
```

### Статус контейнеров:
```bash
docker-compose -f docker-compose.prod.yml ps
```

### Настройка SSL:
```bash
./init-ssl.sh
```

## Быстрый старт:

1. Создайте .env (если еще нет):
```bash
cp .env.example .env
nano .env  # Измените POSTGRES_PASSWORD
```

2. Запустите:
```bash
./start.sh
```

3. Для SSL:
```bash
./init-ssl.sh
```
