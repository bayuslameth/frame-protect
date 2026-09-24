### Table 1 — Baseline Verification

| Algorithm | PSNR | NC | BER | Extraction Status |
|---|---|---|---|---|
| DCT | N/A | N/A | N/A | FAILED |

### Table 2 — JPEG Compression

| Quality | PSNR | NC | BER | Extraction Status |
|---|---|---|---|---|
| Q90 | 48.63 | 1.0000 | 0.0000 | DETECTED |
| Q70 | 41.17 | -0.0288 | 0.5144 | DETECTED |
| Q50 | 39.12 | -0.0865 | 0.5433 | DETECTED |

### Table 3 — Crop

| Crop Percentage | Dimensions | PSNR | NC | BER | Extraction Status |
|---|---|---|---|---|---|
| 10% | 1152x648 | N/A | 0.0769 | 0.4615 | DETECTED |
| 25% | 960x540 | N/A | 0.2115 | 0.3942 | DETECTED |

### Table 4 — Resize

| Scale | Dimensions | PSNR | NC | BER | Extraction Status |
|---|---|---|---|---|---|
| 75% | 960x540 | N/A | -0.0385 | 0.5192 | DETECTED |
| 50% | 640x360 | N/A | 0.0192 | 0.4904 | DETECTED |

### Table 5 — Gaussian Noise

| Sigma | PSNR | NC | BER | Extraction Status |
|---|---|---|---|---|
| 5 | 34.22 | 1.0000 | 0.0000 | DETECTED |
| 10 | 28.45 | 0.8365 | 0.0817 | DETECTED |
| 20 | 22.82 | 0.2500 | 0.3750 | DETECTED |

### Table 6 — Brightness

| Brightness Parameter | PSNR | NC | BER | Extraction Status |
|---|---|---|---|---|
| -30 | 15.60 | 1.0000 | 0.0000 | DETECTED |
| 30 | 18.97 | 0.7885 | 0.1058 | DETECTED |

### Table 7 — Contrast

| Contrast Parameter | PSNR | NC | BER | Extraction Status |
|---|---|---|---|---|
| 0.7 | 19.53 | 1.0000 | 0.0000 | DETECTED |
| 1.0 | N/A | 1.0000 | 0.0000 | DETECTED |
| 1.3 | 21.67 | 0.5865 | 0.2067 | DETECTED |