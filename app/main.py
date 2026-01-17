import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import products, cart, admin
from app.database import engine, Base
from app.core.config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Shop API",
    description="API для интернет-магазина 404tears.kz",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(cart.router)
app.include_router(admin.router)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)