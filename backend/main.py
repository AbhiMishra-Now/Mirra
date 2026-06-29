from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import users, products, tryon, rater, history

app = FastAPI(title="MIRRA Secure API", version="1.0.0")

import os

# Setup CORS for frontend communication dynamically from env variables
frontend_url = os.getenv("FRONTEND_URL")
origins = ["http://localhost:3000", "https://your-vercel-domain.vercel.app"]
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(users.router)
app.include_router(products.router)
app.include_router(tryon.router)
app.include_router(rater.router)
app.include_router(history.router)



@app.get("/")
async def root():
    return {"message": "Welcome to the MIRRA Backend API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

