# AI-Based Smart Expense Tracker

## Overview

This is a full-stack expense tracking application powered by AI. Users can add and split expenses, categorize them automatically using a trained ML model, and get real-time visualizations and insights.

## Features

- Add, split, and categorize expenses
- AI-powered smart category suggestions
- Real-time debt summary
- Chart-based visualizations (bar/pie)
- Monthly budget alerts with overspending detection
- Export expenses as CSV/PDF

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js (Express) or Flask
- **Database**: PostgreSQL
- **Machine Learning**: Scikit-learn, Pandas
- **Visualization**: Chart.js, Power BI (optional)

## Project Structure

- `frontend/` – Static UI, client-side logic
- `backend/` – API, ML integration, DB handling
- `ml/` – Model training and `.pkl` files
- `notebook/` – Jupyter notebooks for ML experiments
- `data/` – Sample datasets

## Setup Instructions

### 1. Clone the Repository

git clone https://github.com/yourusername/ai-expense-tracker.git
cd ai-expense-tracker

### 2. Backend Setup
Install dependencies and run:

# For Flask
pip install -r requirements.txt
python app.py

# OR for Node.js
npm install
node server.js

### 3.Frontend
Open frontend/index.html in a browser directly or serve with live server.

### 4. PostgreSQL
Run the schema in backend/db/schema.sql to create necessary tables.

### 5.Machine Learning
The model is already trained and saved as category_predictor.pkl.
To retrain, run the notebook in notebook/ml_model_training.ipynb.

### Future Enhancements:
Mobile-first responsive UI
Integration with SMS/email alerts

### Author
B. Ruchitha




