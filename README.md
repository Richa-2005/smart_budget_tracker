# Smart Budget Tracker 🚀

A modern, production-grade personal finance application built with the **MERN Stack** and supercharged by a **FastAPI Machine Learning Intelligence Layer**.

## 🌟 Key Features

### Core Budgeting (MERN)
*   **Secure Authentication**: JWT-based user authentication and protected routes.
*   **Calendar-based Tracking**: Intuitive UI to track daily expenses on a calendar.
*   **Dynamic Dashboard**: Visualizes your spending habits using Recharts.
*   **Budget Goals**: Set and monitor weekly and monthly spending targets.

### 🧠 AI Intelligence Layer (FastAPI + Scikit-Learn)
*   **Smart Auto-Categorization**: Natural Language Processing (TF-IDF Vectorization) automatically predicts the correct category (Food, Transport, Bills, etc.) based solely on your expense description.
*   **Necessity vs. Misc Prediction**: The model determines whether an expense was a "Necessity" or "Miscellaneous" to help audit your spending habits.
*   **Overspending Risk Prediction**: An intelligent algorithm evaluates your current spend velocity, days remaining in the month, and budget limits to predict your "Risk Level" (High, Medium, Low) of overspending.
*   **AI Explainability**: Transparent UX that shows prediction confidence scores, highlights underlying keywords driving the prediction, and flags low-confidence predictions for user verification.
*   **Smart Recommendation Engine**: Context-aware financial tips, warnings, and insights generated based on your real-time budget distribution.
*   **Graceful Degradation**: If the ML microservice fails, the Node.js backend seamlessly catches the error and allows the React frontend to fallback to manual entry without breaking the UX.

## 🛠 Tech Stack

*   **Frontend**: React, Vite, CSS Modules, Recharts, Axios, React-Toastify.
*   **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT.
*   **ML Service**: Python, FastAPI, Scikit-Learn, Pandas, Uvicorn.

## 🚀 Getting Started

To run the full stack locally, you need three terminal instances.

### 1. Start the Machine Learning Service
```bash
cd ml-service
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate
# Install requirements
pip install -r requirements.txt
# (Optional) Retrain the model on the dataset
python train_model.py
# Start the FastAPI server
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start the Node.js Backend
```bash
# In the root directory
npm install
# Ensure you have a .env file with MONGO_URI, JWT_SECRET, and PORT=5500
npm run dev
```

### 3. Start the React Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📊 How the ML Works
The intelligence layer uses `scikit-learn` to train two distinct **Logistic Regression** models on a synthetic `.csv` dataset of common expenses. It uses a **TfidfVectorizer** to convert text descriptions into a matrix of token counts, allowing the model to grasp semantic relevance and extract keywords. The models and vectorizers are pickled (`.pkl`) and loaded into memory by the FastAPI server on startup for sub-millisecond predictions.
