import google.generativeai as genai
import json
import os
from dotenv import load_dotenv


load_dotenv(dotenv_path='api.env')

# --- Configuration ---

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("CRITICAL ERROR: GEMINI_API_KEY was not found. Check your api.env file.")
genai.configure(api_key=api_key)


# ---Function ---
def analyze_transaction(transaction_text: str) -> dict:
    """
    Analyzes a transaction string to categorize it and provide a spending suggestion.
    """
    print(f"  > Contacting Google AI with model 'gemini-pro'...")

    model = genai.GenerativeModel('gemini-pro')
    
 
    prompt_template = f"""
    You are a friendly and helpful financial assistant AI for a smart budget tracker app. Your goal is to help users understand their spending and find ways to save money.

    Analyze the transaction description and perform two tasks:
    1. Categorize it into one of the predefined categories.
    2. Provide a brief, helpful suggestion related to that spending category.

    Return the output ONLY as a valid JSON object with four keys: "category", "merchant", "spending_type", and "suggestion".

    - "spending_type" must be one of: "Essential", "Discretionary", "Subscription", or "Income/Transfer".
    - For "Discretionary" spending, the suggestion should be a friendly tip on how to save.
    - For "Essential" or "Subscription" spending, the suggestion can be a neutral observation or a tip on how to manage it better.

    Predefined Categories:
    ["Food & Dining", "Transportation", "Groceries", "Shopping", "Bills & Utilities", "Health & Wellness", "Entertainment", "Transfers", "Other"]

    Transaction Description: "{transaction_text}"

    JSON Output:
    """
    
    try:
        response = model.generate_content(prompt_template)
        json_response_text = response.text.strip().replace("```json", "").replace("```", "")
        result = json.loads(json_response_text)
        return result

    except Exception as e:
        print(f"  > An API error occurred: {e}")
        return {"category": "Error", "merchant": "Error", "spending_type": "Error", "suggestion": "Could not analyze."}

# ---Test code
if __name__ == "__main__":
    test_transaction = "ZARA FASHIONS MUMBAI"
    print(f"Analyzing Transaction: '{test_transaction}'")
    
    analyzed_result = analyze_transaction(test_transaction)
    
    print("\n--- Analysis Result ---")
    print(json.dumps(analyzed_result, indent=2))