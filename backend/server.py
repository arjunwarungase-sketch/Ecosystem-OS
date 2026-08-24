from fastapi import FastAPI

from backend.state import device_state
from backend.simulator import get_sensor_data

app = FastAPI()


@app.get("/")
def home():
    return {
        "system": "Ecosystem OS",
        "status": "online"
    }


@app.get("/sensors")
def sensors():
    return get_sensor_data()