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

```bash
git clone https://github.com/yourusername/ai-expense-tracker.git
cd ai-expense-tracker
