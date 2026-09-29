from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.watermark import router as watermark_router
from .api.metrics import router as metrics_router
from .api.attack import router as attack_router

app = FastAPI(title="Frame Protect API", description="Watermarking Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(watermark_router, prefix="/api/watermark", tags=["Watermark"])
app.include_router(metrics_router, prefix="/api/metrics", tags=["Metrics"])
app.include_router(attack_router, prefix="/api/attacks", tags=["Attacks"])
