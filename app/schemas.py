from pydantic import BaseModel, Field
from typing import List, Optional

class ProductOut(BaseModel):
    id: int
    name: str
    price: float
    image: str
    category: str

    class Config:
        from_attributes = True


class ProductDetail(ProductOut):
    description: str


class ProductListResponse(BaseModel):
    count: int
    next: Optional[str]
    previous: Optional[str]
    results: List[ProductOut]


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class CartItemUpdate(BaseModel):
    quantity: int = Field(gt=0)


class CartItemOut(BaseModel):
    id: int
    product: ProductOut
    quantity: int

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    items: List[CartItemOut]
    total: float
