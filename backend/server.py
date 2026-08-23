from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def home():
    return {
        "system": "Ecosystem OS",
        "status": "online"
    }


@app.get("/sensors")
def sensors():
    return {
        "air_temperature": 26.4,
        "humidity": 82,
        "soil_temperature": 24.8,
        "soil_moisture": 61,
        "water_level": 78,
        "air_quality": "GOOD"
    }