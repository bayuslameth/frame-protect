# System Architecture

## Overview
Frame Protect utilizes a decoupled client-server architecture with a Next.js frontend and a FastAPI backend.

## Frontend (Next.js)
- **Framework**: React 19 / Next.js 16 (App Router).
- **Styling**: Tailwind CSS v4 using a minimal Light Editorial design system.
- **Role**: Handles user interaction, file selection, API formulation (FormData multipart boundaries), and results rendering.
- **Directory**: `/frontend`

## Backend (FastAPI)
- **Framework**: FastAPI (Python).
- **Math/Image**: NumPy, Pillow.
- **Role**: Pure computation. No persistence layers (no databases).
- **Modules**:
  - `api/`: Route controllers (`watermark.py`, `metrics.py`, `attacks.py`).
  - `watermark/`: DCT logic, PRNG seeding, binary parsing.
  - `metrics/`: PSNR, NC, BER calculators.
  - `attacks/`: Signal degradation scripts.
- **Directory**: `/backend`