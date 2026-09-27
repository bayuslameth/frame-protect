# FRAME PROTECT
**"Protect the Image. Prove the Origin."**

## About
Frame Protect is an academic Digital Watermarking laboratory application. It facilitates the embedding, extraction, and robustness-testing of invisible cryptographic watermarks using frequency-domain transforms.

## Project Objective
To provide a verifiable, mathematically transparent, and robust implementation of Discrete Cosine Transform (DCT) watermarking without relying on black-box libraries, complete with automated degradation evaluation metrics (PSNR, NC, BER).

## Technology Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4.
- **Backend**: FastAPI, Python 3.12+, NumPy, Pillow.

## Watermarking Method
- **Algorithm**: 8x8 Block DCT-II.
- **Embedding**: Mid-frequency coefficient magnitude modulation.
- **Security**: SHA-256 derived PRNG seed for deterministic block selection.

## Project Structure
- `/backend`: FastAPI Python daemon and core NumPy algorithms.
- `/frontend`: Next.js web application.
- `/docs`: Academic documentation, algorithm schemas, and experiment data.
- `/tests`: Backend PyTest suite.

## Documentation References
For detailed information, refer to the accompanying documentation:
- [Algorithm Detail](docs/ALGORITHM.md)
- [System Architecture](docs/ARCHITECTURE.md)
- [Experiment Results & Reports](docs/experiments/EXPERIMENT_REPORT.md)
- [API Endpoints](docs/API.md)
- [Technical Limitations](docs/LIMITATIONS.md)

## Reproducibility
Please see the [Reproducibility Guide](docs/REPRODUCIBILITY.md) for instructions on installing dependencies, running the local servers, and autonomously executing the dataset experiments.

## AI Usage Disclosure
Generative AI assistance was utilized transparently for UI scaffolding and test-generation. See [AI Disclosure](docs/AI_DISCLOSURE.md) for details.