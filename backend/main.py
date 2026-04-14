from pathlib import Path
import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="KPI Data API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:9002", "http://127.0.0.1:9002"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "kpi-data.json"


def load_kpi_data():
    return json.loads(DATA_FILE.read_text(encoding="utf-8"))


@app.get("/kpi")
def get_kpi():
    return load_kpi_data()
