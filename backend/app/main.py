from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <--- Import this
from contextlib import asynccontextmanager
from app.core.database import engine, Base
from app.api.v1 import auth, sweets

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="Sweet Shop Management System", lifespan=lifespan)

# --- ADD THIS BLOCK ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow your React Frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (POST, GET, etc)
    allow_headers=["*"],  # Allow all headers
)
# ----------------------

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(sweets.router, prefix="/api/sweets", tags=["Sweets"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Sweet Shop API"}