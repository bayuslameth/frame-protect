# Reproducibility Guide

## Prerequisites
- Node.js (v20+)
- Python (3.12+)

## Setup

1. **Clone and Install Backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Start Backend**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

3. **Install and Start Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:3000`.

## Reproducing Experiments
To autonomously reproduce the robustness evaluation dataset:
```bash
# Ensure backend is running
backend/venv/bin/python run_experiments.py
```
This writes CSV and image files directly to the `/docs/experiments/` folder.