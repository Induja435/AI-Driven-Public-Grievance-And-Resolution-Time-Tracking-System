import random
import pandas as pd

departments = {
    "Water": [
        "water leakage in street", "tap not working", "pipe broken near house",
        "no water supply", "low water pressure", "water overflow from tank"
    ],
    "Electrical": [
        "street light not working", "power failure in area", "wire sparking issue",
        "voltage fluctuation", "transformer issue", "electric pole damaged"
    ],
    "Sanitation": [
        "garbage not collected", "waste overflow", "dustbin not cleaned",
        "bad smell in area", "drainage blockage", "sewage overflow"
    ],
    "Road": [
        "road damaged badly", "potholes on road", "road needs repair",
        "cracks on street", "road water logging", "broken sidewalk"
    ],
    "General": [
        "need help regarding complaint", "issue not categorized",
        "general inquiry", "public problem", "unknown issue",
        "miscellaneous complaint"
    ]
}

priority_map = {
    "HIGH": 2,
    "MEDIUM": 4,
    "LOW": 6
}

data = []

for _ in range(1000):
    dept = random.choice(list(departments.keys()))
    text = random.choice(departments[dept])

    # Assign priority logically
    if "leakage" in text or "failure" in text or "overflow" in text:
        priority = "HIGH"
    elif "not working" in text or "damaged" in text:
        priority = "MEDIUM"
    else:
        priority = random.choice(["LOW", "MEDIUM"])

    resolution_days = priority_map[priority]

    data.append([text, dept, priority, resolution_days])

df = pd.DataFrame(data, columns=["text", "department", "priority", "resolutionDays"])

df.to_csv("data.csv", index=False)

print("✅ 1000 dataset generated successfully!")