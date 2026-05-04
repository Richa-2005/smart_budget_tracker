from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pickle
import os

app = FastAPI(title="Smart Budget ML Service")

# Allow CORS for backend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExpenseInput(BaseModel):
    description: str
    amount: float

class RiskInput(BaseModel):
    weeklySpent: float
    monthlySpent: float
    weeklyBudget: float
    monthlyBudget: float
    daysPassed: int
    totalDays: int
    avgDailySpend: float
    miscRatio: float
    transactionCount: int

# Load models
VECTORIZER_PATH = "models/vectorizer.pkl"
CATEGORY_MODEL_PATH = "models/category_model.pkl"
NEED_MODEL_PATH = "models/need_model.pkl"

vectorizer = None
cat_model = None
need_model = None

@app.on_event("startup")
def load_models():
    global vectorizer, cat_model, need_model
    if os.path.exists(VECTORIZER_PATH):
        with open(VECTORIZER_PATH, "rb") as f:
            vectorizer = pickle.load(f)
    if os.path.exists(CATEGORY_MODEL_PATH):
        with open(CATEGORY_MODEL_PATH, "rb") as f:
            cat_model = pickle.load(f)
    if os.path.exists(NEED_MODEL_PATH):
        with open(NEED_MODEL_PATH, "rb") as f:
            need_model = pickle.load(f)

@app.get("/")
def root():
    return {"status": "ML Service is running. Models loaded: " + str(vectorizer is not None)}

@app.post("/predict-expense")
def predict_expense(expense: ExpenseInput):
    if not vectorizer or not cat_model or not need_model:
        # Fallback if models are not trained yet
        return {
            "category": "Uncategorized",
            "need": "miscellaneous",
            "categoryConfidence": 0.0,
            "needConfidence": 0.0,
            "keywords": []
        }
    
    text = [expense.description.lower()]
    X_vec = vectorizer.transform(text)
    
    feature_names = vectorizer.get_feature_names_out()
    nonzero_indices = X_vec.nonzero()[1]
    keywords = [feature_names[i] for i in nonzero_indices]
    
    # Predict category
    cat_pred = cat_model.predict(X_vec)[0]
    cat_probs = cat_model.predict_proba(X_vec)[0]
    cat_conf = float(max(cat_probs))
    
    # Predict need
    need_pred = need_model.predict(X_vec)[0]
    need_probs = need_model.predict_proba(X_vec)[0]
    need_conf = float(max(need_probs))
    
    return {
        "category": cat_pred,
        "need": need_pred,
        "categoryConfidence": round(cat_conf, 2),
        "needConfidence": round(need_conf, 2),
        "keywords": keywords
    }

@app.post("/predict-risk")
def predict_risk(data: RiskInput):
    # Rule-based logic for v1 (to be replaced by ML model later)
    risk_level = "low"
    confidence = 0.90
    
    if data.monthlyBudget > 0:
        if data.monthlySpent > 0.8 * data.monthlyBudget and data.daysPassed < data.totalDays * 0.7:
            risk_level = "high"
            confidence = 0.85
        elif data.monthlySpent > 0.9 * data.monthlyBudget:
            risk_level = "high"
            confidence = 0.95
        elif data.monthlySpent > 0.6 * data.monthlyBudget and data.daysPassed < data.totalDays * 0.5:
            risk_level = "high"
            confidence = 0.75
        elif data.monthlySpent > 0.6 * data.monthlyBudget:
            risk_level = "medium"
            confidence = 0.80
            
    return {
        "riskLevel": risk_level,
        "confidence": confidence
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
