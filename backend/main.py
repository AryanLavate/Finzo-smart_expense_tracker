from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.session import Base, engine
from app.models.user import User
from app.models.transaction import Transaction
from app.models.insurance import InsurancePolicy

app = FastAPI(title="Smart Expense Tracker API")

# Ensure DB tables exist (simple project setup).
Base.metadata.create_all(bind=engine)

# Add CORS middleware
# Note: allow_origins="*" cannot be used with allow_credentials=True (browser blocks it)
# Explicitly list frontend origins for local dev and common production setups
origins = [
    "http://localhost:5173",   # Vite default
    "http://localhost:3000",
    "http://localhost:4173",   # Vite preview
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:4173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # Allow any localhost/127.0.0.1 port for Vite auto-port changes (e.g., 5174).
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
from app.api.endpoints import auth, transactions, analytics, insurance, admin

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
app.include_router(insurance.router, prefix="/insurance", tags=["Insurance"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Smart Expense Tracker API"}
