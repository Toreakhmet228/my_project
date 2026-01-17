# Как добавить товары в базу данных

## Способ 1: Через API (рекомендуется)

1. Убедитесь, что бэкенд запущен:
   ```bash
   cd app
   python -m uvicorn app.main:app --reload
   ```

2. Откройте браузер и перейдите по адресу:
   ```
   http://127.0.0.1:8000/api/admin/add-products
   ```
   
   Или используйте curl:
   ```bash
   curl -X POST http://127.0.0.1:8000/api/admin/add-products
   ```

3. Если нужно заменить все товары новыми:
   ```
   http://127.0.0.1:8000/api/admin/clear-and-add
   ```

## Способ 2: Через Python скрипт

1. Убедитесь, что установлены все зависимости:
   ```bash
   cd app
   pip install -r req.txt
   ```

2. Запустите скрипт:
   ```bash
   cd ..
   python3 add_products.py
   ```

## Что будет добавлено:

1. iPhone 15 Pro - 999.99 ₸ (electronics)
2. Samsung Galaxy S24 - 899.99 ₸ (electronics)
3. Nike Air Max 270 - 149.99 ₸ (clothing)
4. Adidas Ultraboost 22 - 179.99 ₸ (clothing)
5. The Great Gatsby - 12.99 ₸ (books)
6. 1984 by George Orwell - 11.99 ₸ (books)
7. MacBook Pro 14 - 1999.99 ₸ (electronics)
8. Sony WH-1000XM5 - 399.99 ₸ (electronics)
9. Organic Coffee Beans - 24.99 ₸ (food)
10. Dark Chocolate Bar - 8.99 ₸ (food)
