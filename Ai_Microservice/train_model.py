import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle

# ✅ SAME CLEAN FUNCTION (VERY IMPORTANT)
def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    return text

# Load dataset
df = pd.read_csv("data/data.csv")
# ✅ APPLY CLEANING HERE
df["text"] = df["text"].apply(clean_text)

# Input and output
X = df["text"]
y = df["department"]

# Convert text → numbers
vectorizer = TfidfVectorizer()
X_vectorized = vectorizer.fit_transform(X)

# Train model
model = LogisticRegression()
model.fit(X_vectorized, y)

# Save model
pickle.dump(model, open("model/model.pkl", "wb"))
pickle.dump(vectorizer, open("model/vectorizer.pkl", "wb"))

print("✅ Model trained with preprocessing and saved!")