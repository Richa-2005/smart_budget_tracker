import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle
import os

def train():
    print("Loading dataset...")
    df = pd.read_csv('data/expenses_dataset.csv')
    
    # Text feature
    X = df['description'].str.lower()
    
    # Targets
    y_category = df['category']
    y_need = df['need']
    
    print("Vectorizing...")
    vectorizer = TfidfVectorizer(max_features=1000)
    X_vec = vectorizer.fit_transform(X)
    
    print("Training category model...")
    cat_model = LogisticRegression(max_iter=1000)
    cat_model.fit(X_vec, y_category)
    
    print("Training need model...")
    need_model = LogisticRegression(max_iter=1000)
    need_model.fit(X_vec, y_need)
    
    print("Saving models...")
    os.makedirs('models', exist_ok=True)
    with open('models/vectorizer.pkl', 'wb') as f:
        pickle.dump(vectorizer, f)
        
    with open('models/category_model.pkl', 'wb') as f:
        pickle.dump(cat_model, f)
        
    with open('models/need_model.pkl', 'wb') as f:
        pickle.dump(need_model, f)
        
    print("Training complete! Models saved in models/")

if __name__ == '__main__':
    train()
