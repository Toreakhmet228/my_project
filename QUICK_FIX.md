# Быстрое решение проблемы с docker-compose

## Проблема:
```
unknown shorthand flag: 'd' in -d
```

Это означает, что у вас установлена старая версия Docker Compose.

## Решение:

### Вариант 1: Использовать docker-compose (с дефисом)

Вместо:
```bash
docker compose up -d --build
```

Используйте:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### Вариант 2: Использовать скрипт start.sh

Скрипт автоматически определит правильную команду:

```bash
./start.sh
```

### Вариант 3: Установить новую версию Docker Compose

```bash
# Для Ubuntu/Debian
sudo apt update
sudo apt install docker-compose-plugin

# Или обновить Docker до последней версии
```

## Правильные команды для вашей версии:

```bash
# Запуск
docker-compose -f docker-compose.prod.yml up -d --build

# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f

# Остановка
docker-compose -f docker-compose.prod.yml down

# Перезапуск
docker-compose -f docker-compose.prod.yml restart
```

## Проверка версии:

```bash
docker-compose --version
# или
docker compose version
```
