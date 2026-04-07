import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
import joblib

# Load data
df = pd.read_csv("data.csv")

# Convert scheme
df["scheme"] = df["scheme"].apply(lambda x: 1 if x == "pmay" else 0)

# Features
X = df[["amount", "scheme", "income", "previous_applications", "age", "duplicate_aadhaar"]]
y = df["fraud"]

# Train model
model = GradientBoostingClassifier()
model.fit(X, y)

# Save model
joblib.dump(model, "model.pkl")

print("✅ Model trained successfully")