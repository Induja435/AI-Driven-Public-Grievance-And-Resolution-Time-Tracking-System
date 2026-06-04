from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import re

app = FastAPI()

# Load model & vectorizer
model = pickle.load(open("model/model.pkl", "rb"))
vectorizer = pickle.load(open("model/vectorizer.pkl", "rb"))

# Request schema (BEST PRACTICE)
class ComplaintRequest(BaseModel):
    text: str

# Text cleaning
def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    return text

@app.get("/")
def home():
    return {"message": "AI Microservice Running"}

@app.post("/predict")
def predict(req: ComplaintRequest):
    try:
        text = clean_text(req.text)

        # Vectorize input
        text_vector = vectorizer.transform([text])

        # Predict department
        department = model.predict(text_vector)[0]

        # Confidence score
        probs = model.predict_proba(text_vector)
        confidence = float(max(probs[0]))

        # Smarter logic for priority
        if confidence > 0.8:
            priority = "HIGH"
            days = 1
        elif confidence > 0.5:
            priority = "MEDIUM"
            days = 3
        else:
            priority = "LOW"
            days = 5
            department = "General"   # fallback

        return {
            "department": department,
            "priority": priority,
            "resolutionDays": days,
            "confidence": confidence
        }

    except Exception as e:
        return {
            "error": str(e),
            "department": "General",
            "priority": "LOW",
            "resolutionDays": 5
        }