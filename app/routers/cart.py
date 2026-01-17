from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.models import Cart, CartItem, Product
from app.schemas import CartItemCreate, CartItemUpdate, CartResponse
from app.deps import get_db

router = APIRouter(prefix="/api/cart", tags=["Cart"])

SESSION_ID = "guest-session"


@router.post("/")
def add_to_cart(data: CartItemCreate, db: Session = Depends(get_db)):
    cart = db.query(Cart).filter_by(session_id=SESSION_ID).first()
    if not cart:
        cart = Cart(session_id=SESSION_ID)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    product = db.get(Product, data.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if item already exists in cart
    existing_item = db.query(CartItem).filter_by(
        cart_id=cart.id, product_id=product.id
    ).first()
    
    if existing_item:
        # Update quantity if item already exists
        existing_item.quantity += data.quantity
    else:
        # Create new item if it doesn't exist
        item = CartItem(
            product_id=product.id,
            quantity=data.quantity,
            cart_id=cart.id,
        )
        db.add(item)
    
    db.commit()
    return {"status": "added"}


@router.get("/", response_model=CartResponse)
def get_cart(db: Session = Depends(get_db)):
    cart = db.query(Cart).options(
        joinedload(Cart.items).joinedload(CartItem.product)
    ).filter_by(session_id=SESSION_ID).first()
    
    if not cart:
        return {"items": [], "total": 0}

    total = sum(float(i.product.price) * i.quantity for i in cart.items)
    return {"items": cart.items, "total": total}


@router.put("/{item_id}")
def update_item(
    item_id: int,
    data: CartItemUpdate,
    db: Session = Depends(get_db),
):
    cart = db.query(Cart).filter_by(session_id=SESSION_ID).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    item = db.query(CartItem).filter_by(id=item_id, cart_id=cart.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    item.quantity = data.quantity
    db.commit()
    return {"status": "updated"}


@router.delete("/{item_id}")
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    cart = db.query(Cart).filter_by(session_id=SESSION_ID).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    item = db.query(CartItem).filter_by(id=item_id, cart_id=cart.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(item)
    db.commit()
    return {"status": "deleted"}
