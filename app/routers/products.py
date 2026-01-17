from fastapi import APIRouter, Depends, Query, Request, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
from urllib.parse import urlencode
from app.models import Product
from app.schemas import ProductListResponse, ProductDetail
from app.deps import get_db

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("/", response_model=ProductListResponse)
def list_products(
    request: Request,
    db: Session = Depends(get_db),
    search: str | None = None,
    category: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    sort: str = Query("price", enum=["price", "name"]),
    order: str = Query("asc", enum=["asc", "desc"]),
    limit: int = 10,
    offset: int = 0,
):
    query = db.query(Product)

    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))

    if category:
        query = query.filter(Product.category == category)

    if min_price:
        query = query.filter(Product.price >= min_price)

    if max_price:
        query = query.filter(Product.price <= max_price)

    order_by = asc if order == "asc" else desc
    query = query.order_by(order_by(getattr(Product, sort)))

    total = query.count()
    items = query.offset(offset).limit(limit).all()

    # Build query parameters for pagination URLs
    base_params = {}
    if search:
        base_params["search"] = search
    if category:
        base_params["category"] = category
    if min_price is not None:
        base_params["min_price"] = min_price
    if max_price is not None:
        base_params["max_price"] = max_price
    base_params["sort"] = sort
    base_params["order"] = order
    base_params["limit"] = limit

    # Calculate next URL
    next_url = None
    if offset + limit < total:
        next_params = {**base_params, "offset": offset + limit}
        query_string = urlencode(next_params)
        next_url = f"{request.url.scheme}://{request.url.netloc}{request.url.path}?{query_string}"

    # Calculate previous URL
    previous_url = None
    if offset > 0:
        prev_offset = max(0, offset - limit)
        prev_params = {**base_params, "offset": prev_offset}
        query_string = urlencode(prev_params)
        previous_url = f"{request.url.scheme}://{request.url.netloc}{request.url.path}?{query_string}"

    return {
        "count": total,
        "next": next_url,
        "previous": previous_url,
        "results": items,
    }


@router.get("/{product_id}", response_model=ProductDetail)
def product_detail(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
