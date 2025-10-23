from fastapi import FastAPI

app = FastAPI()

@app.get("/predict")
def predict():
    # This is a stub. Later replace with real model inference.
    return {"disease": "demo-disease", "confidence": 0.72}
