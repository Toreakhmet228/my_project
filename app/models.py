import uuid
from sqlalchemy import String, Integer, ForeignKey, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    price: Mapped[float] = mapped_column(Numeric(10, 2))
    image: Mapped[str] = mapped_column(String(500))
    category: Mapped[str] = mapped_column(String(100))


class Cart(Base):
    __tablename__ = "carts"

    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[str] = mapped_column(String(100), index=True)

    items = relationship("CartItem", back_populates="cart", cascade="all, delete")


class CartItem(Base):
    __tablename__ = "cart_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    quantity: Mapped[int] = mapped_column(Integer)

    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    cart_id: Mapped[int] = mapped_column(ForeignKey("carts.id"))

    product = relationship("Product")
    cart = relationship("Cart", back_populates="items")
