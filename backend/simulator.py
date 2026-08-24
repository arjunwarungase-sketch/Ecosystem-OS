import random


def get_sensor_data():
    return {
        "air_temperature": round(random.uniform(24, 30), 1),
        "humidity": random.randint(70, 90),
        "soil_temperature": round(random.uniform(22, 27), 1),
        "soil_moisture": random.randint(50, 75),
        "water_level": random.randint(65, 90),
        "air_quality": "GOOD"
    }