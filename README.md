# Интернет-магазин 404tears.kz

Полнофункциональный интернет-магазин с React фронтендом и FastAPI бэкендом.

## Структура проекта

```
PythonProject/
├── app/              # FastAPI бэкенд
│   ├── routers/      # API роутеры
│   ├── models.py     # SQLAlchemy модели
│   ├── schemas.py    # Pydantic схемы
│   └── main.py       # Точка входа
├── shop/             # React фронтенд
│   ├── src/          # Исходный код
│   └── public/       # Статические файлы
└── docker-compose.prod.yml  # Docker Compose для продакшена
```

## Быстрый старт (разработка)

### Бэкенд

```bash
cd app
pip install -r req.txt
python -m uvicorn app.main:app --reload
```

### Фронтенд

```bash
cd shop
npm install
npm run dev
```

## Деплой на продакшен

См. [DEPLOY.md](./DEPLOY.md) для подробных инструкций.

Быстрый старт:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

## Функционал

- ✅ Каталог товаров с фильтрацией и поиском
- ✅ Корзина покупок
- ✅ Детальные страницы товаров
- ✅ Пагинация
- ✅ RESTful API

## Технологии

**Бэкенд:**
- FastAPI
- SQLAlchemy
- PostgreSQL
- Docker

**Фронтенд:**
- React 19
- TypeScript
- Vite
- React Router
- Axios

## Документация

- [DEPLOY.md](./DEPLOY.md) - Инструкция по деплою
- [QUICK_START.md](./QUICK_START.md) - Быстрый старт
- [ADD_PRODUCTS.md](./ADD_PRODUCTS.md) - Добавление товаров
