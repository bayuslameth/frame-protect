# Testing Documentation

## Backend Tests (PyTest)
- **Purpose**: Validates mathematical boundaries of DCT matrices, secret key determinism, metric calculation correctness (PSNR/NC/BER rules), and API HTTP responses.
- **Command**:
  ```bash
  cd backend
  pytest tests/ -v
  ```
- **Status**: 17/17 tests passing.

## Frontend Validation
- **Purpose**: Asserts strict TypeScript type safety and Next.js compiler static generation compliance (hydration matches).
- **Command**:
  ```bash
  cd frontend
  npx tsc --noEmit && npm run build
  ```
- **Status**: Passes without errors.