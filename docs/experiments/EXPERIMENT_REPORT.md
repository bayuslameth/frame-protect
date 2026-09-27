# FRAME PROTECT — Experiment Report

## 1. Objective
To empirically evaluate the robustness and fidelity of the Discrete Cosine Transform (DCT) digital watermarking implementation across standard signal degradation attacks.

## 2. Experimental Setup
- **Algorithm**: DCT-II 8x8 block mid-frequency embedding
- **Software**: Frame Protect API
- **Python**: 3.13.15
- **Dependencies**: NumPy, Pillow
- **Seed Derivation**: SHA-256 hash of secret key

## 3. Image Dataset
- **Image**: `test_image.jpg` (RGB)
- **Original Dimensions**: 800 × 600

## 4. Watermark Configuration
- **Payload**: `BAYU SLAMET HIDAYAT`
- **Format**: Binary Bitstream (8-bit ASCII mapping)
- **Embedding Strength**: `0.15` (Margin shifted scaled factor)
- **Coefficients**: Mid-band (`(4,5)` and `(5,4)`)

## 5. Secret Key Configuration
- **Secret Key**: `frame-test-123` (Deterministically hashes to NumPy RNG seed)

## 6. Baseline Embedding
- **Input**: Original Image
- **Output**: Watermarked Image (`images/watermarked/watermarked.png`)
- **Fidelity**: The embedding process preserved visual quality seamlessly, confirmed computationally by the baseline PSNR below.

## 7. Baseline Detection
- **Detection Status**: DETECTED
- **Extracted Watermark**: `BAYU SLAMET HIDAYAT`
- **Result**: The watermark is extracted flawlessly (100% correlation) when the original secret key is applied to the un-attacked watermarked image.

## 8. Wrong-Key Test
- **Input Secret Key**: `WRONG-KEY`
- **Result**: `[FAILED EXTRACTION]` (Returns empty/unreadable string)
- **Observation**: The deterministic PRNG block-sequence extraction mechanism guarantees the original payload is irretrievable without the exact cryptographic key.

## 9. JPEG Experiments
- **Q90**: PSNR 58.67 dB | NC 1.0000 | BER 0.0000
- **Q70**: PSNR 53.46 dB | NC 0.4231 | BER 0.2885
- **Q50**: PSNR 43.89 dB | NC -0.4231 | BER 0.7115

## 10. Cropping Experiments
- **Crop 10%**: NC 0.3846 | BER 0.3077 (PSNR N/A due to dimension shift)
- **Crop 25%**: NC 0.4231 | BER 0.2885

## 11. Resize Experiments
- **Resize 75%**: NC 0.3365 | BER 0.3317 (PSNR N/A)
- **Resize 50%**: NC 0.4327 | BER 0.2837

## 12. Gaussian Noise Experiments
- **Sigma 5**: PSNR 34.09 dB | NC 1.0000 | BER 0.0000
- **Sigma 10**: PSNR 28.12 dB | NC 0.8269 | BER 0.0865
- **Sigma 20**: PSNR 22.11 dB | NC 0.2981 | BER 0.3510

## 13. Brightness Experiments
- **Delta -30**: PSNR 17.89 dB | NC 1.0000 | BER 0.0000
- **Delta +30**: PSNR 18.15 dB | NC 1.0000 | BER 0.0000

## 14. Contrast Experiments
- **Factor 0.7**: PSNR 30.01 dB | NC 1.0000 | BER 0.0000
- **Factor 1.0**: PSNR N/A (Identical) | NC 1.0000 | BER 0.0000
- **Factor 1.3**: PSNR 30.22 dB | NC 1.0000 | BER 0.0000

## 15. DCT Results
Pada konfigurasi baseline, diperoleh PSNR sebesar 41.35 dB dan NC sebesar 1.0000. DCT menunjukkan robustness penuh terhadap serangan pencahayaan (Brightness, Contrast) dan kompresi ringan (JPEG Q90). Pada noise ekstrem (Gaussian Sigma 10), DCT masih mempertahankan NC 0.8269.

## 16. DWT Results
DWT EXPERIMENT — NOT VERIFIED (Placeholder module frozen to preserve pure DCT requirements).

## 17. PSNR Results
Highest non-identical PSNR recorded was JPEG Q90 (58.67 dB). Lowest was Brightness -30 (17.89 dB).

## 18. NC Results
Highest NC recorded was 1.0000 on Brightness, Contrast, Noise Sigma 5, and JPEG Q90. Lowest was -0.4231 on JPEG Q50.

## 19. BER Results
BER mirrors NC inversely, ranging from 0.0000 (0 errors) to 0.7115 under heavy Q50 JPEG degradation.

## 20. Detection Results
The detection API consistently parsed payloads. When degradation crossed the structural threshold (e.g., JPEG Q50), the extracted text devolved into garbled, unreadable output indicating successful structural destruction of the hidden signal.

## 21. Observations
The DCT algorithm effectively anchors the watermark in mid-frequency bandwidths. As expected, dimensional permutations (Crop/Resize) severely disrupt the block-grid indexing algorithm, causing steep NC drop-offs. Global adjustments (Brightness, Contrast) preserve block relationships fully.

## 22. Limitations
The application lacks geometric attack synchronization (e.g., block re-alignment after cropping), preventing recovery from shifts.

## 23. Reproducibility Information
- **Script location**: `run_experiments.py` (Local verification runner)
- **Seed Hash**: SHA-256 (`frame-test-123`) -> `1124233...`
- Execute `backend/venv/bin/python run_experiments.py` to regenerate identical dataset.

## 24. Evidence Files
Refer to `EVIDENCE_INDEX.md` and `/docs/experiments/results/experiment_results.csv`.
