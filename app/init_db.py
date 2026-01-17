#!/usr/bin/env python3
"""
Простой скрипт для добавления товаров в базу данных
Запуск: python3 app/init_db.py
"""
import sys
import os

# Добавляем корневую директорию в путь
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine, Base
from app.models import Product

# Создаем таблицы если их нет
Base.metadata.create_all(bind=engine)

products_data = [
    {
        "name": "iPhone 15 Pro",
        "description": "Новейший смартфон от Apple с процессором A17 Pro, камерой 48 МП и дисплеем Super Retina XDR.",
        "price": 999.99,
        "image": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
        "category": "electronics"
    },
    {
        "name": "Samsung Galaxy S24",
        "description": "Флагманский смартфон Samsung с экраном AMOLED 6.2 дюйма, камерой 50 МП и батареей 4000 мАч.",
        "price": 899.99,
        "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
        "category": "electronics"
    },
    {
        "name": "Nike Air Max 270",
        "description": "Спортивные кроссовки с технологией Air Max для максимального комфорта при беге.",
        "price": 149.99,
        "image": "https://images.unsplash.com/photo-1542291026-7eec32c3a7ba?w=500",
        "category": "clothing"
    },
    {
        "name": "Adidas Ultraboost 22",
        "description": "Беговые кроссовки с технологией Boost для отличной амортизации и энергоотдачи.",
        "price": 179.99,
        "image": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
        "category": "clothing"
    },
    {
        "name": "The Great Gatsby",
        "description": "Классический роман Ф. Скотта Фицджеральда о жизни в Америке 1920-х годов.",
        "price": 12.99,
        "image": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
        "category": "books"
    },
    {
        "name": "1984 by George Orwell",
        "description": "Антиутопический роман о тоталитарном обществе и потере свободы.",
        "price": 11.99,
        "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
        "category": "books"
    },
    {
        "name": "MacBook Pro 14",
        "description": "Ноутбук Apple с чипом M3 Pro, дисплеем Liquid Retina XDR 14.2 дюйма и 18 часов работы от батареи.",
        "price": 1999.99,
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        "category": "electronics"
    },
    {
        "name": "Sony WH-1000XM5",
        "description": "Беспроводные наушники с активным шумоподавлением и 30-часовым временем работы.",
        "price": 399.99,
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        "category": "electronics"
    },
    {
        "name": "Organic Coffee Beans",
        "description": "Премиум органические кофейные зерна из Эфиопии, 1 кг. Идеально для эспрессо.",
        "price": 24.99,
        "image": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500",
        "category": "food"
    },
    {
        "name": "Dark Chocolate Bar",
        "description": "Темный шоколад 85% какао, 100г. Без добавления сахара, только натуральные ингредиенты.",
        "price": 8.99,
        "image": "https://images.unsplash.com/photo-1606312619070-d48b4cbc5e84?w=500",
        "category": "food"
    }
]

def main():
    db = SessionLocal()
    try:
        print("Подключение к базе данных...")
        
        # Проверяем подключение
        db.execute("SELECT 1")
        print("✓ Подключение успешно")
        
        # Добавляем товары
        added = 0
        skipped = 0
        for product_data in products_data:
            existing = db.query(Product).filter(Product.name == product_data["name"]).first()
            if not existing:
                product = Product(**product_data)
                db.add(product)
                added += 1
                print(f"✓ Добавлен: {product_data['name']}")
            else:
                skipped += 1
                print(f"- Пропущен (уже есть): {product_data['name']}")
        
        db.commit()
        
        total = db.query(Product).count()
        print(f"\n{'='*50}")
        print(f"Готово!")
        print(f"Добавлено новых: {added}")
        print(f"Пропущено (уже есть): {skipped}")
        print(f"Всего товаров в базе: {total}")
        print(f"{'='*50}")
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Ошибка: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    main()
