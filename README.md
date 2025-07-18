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
<img width="721" height="800" alt="image" src="https://github.com/user-attachments/assets/2e23519e-c4ea-40f1-8618-96ff15a41279" />
<img width="677" height="808" alt="image" src="https://github.com/user-attachments/assets/cd411f60-0ded-4abe-801a-fbdba79d551c" />
<img width="579" height="872" alt="image" src="https://github.com/user-attachments/assets/1055ac0c-dc29-42c4-95a3-9f36369ba8e1" />
<img width="682" height="870" alt="image" src="https://github.com/user-attachments/assets/b3fc42b0-77a8-408e-8201-c6acf3db381b" />
<img width="1115" height="878" alt="image" src="https://github.com/user-attachments/assets/4efdd79b-b17d-41de-82a5-03c3771e8948" />

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




