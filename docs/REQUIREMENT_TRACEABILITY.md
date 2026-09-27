# REQUIREMENT TRACEABILITY MATRIX

| ID | Requirement | Source | PRD Reference | Implementation | Test/Bukti | Status |
|----|-------------|--------|---------------|----------------|------------|--------|
| DW-01 | Watermark embedding | Assignment | DCT Embedding | `backend/app/watermark/embed.py` | Pytest / API E2E | PASS |
| DW-02 | Watermark extraction | Assignment | DCT Detection | `backend/app/watermark/extract.py` | Pytest / API E2E | PASS |
| DW-03 | Secret Key dependency | Assignment | Secret Key | `backend/app/watermark/key.py` | Tested wrong key fails | PASS |
| DW-04 | No black-box libraries | Assignment | Architecture | `backend/app/watermark/dct.py` | NumPy manual matrix math | PASS |
| DCT-01 | 8x8 Block partition | Assignment | DCT Workflow | `embed.py: _embed_bit` | Sliced `y_array[r:r+8, c:c+8]` | PASS |
| DCT-02 | Mid-coefficient embedding | Assignment | DCT Workflow | `embed.py: U1, V1 = 4, 5` | Explicit indices used | PASS |
| MET-01 | PSNR Metric | Assignment | Metrics | `backend/app/metrics/psnr.py` | Standard MSE log calc | PASS |
| MET-02 | NC Metric | Assignment | Metrics | `backend/app/metrics/nc.py` | Bipolar vector correlation | PASS |
| MET-03 | BER Metric | Assignment | Metrics | `backend/app/metrics/ber.py` | Binary bit diff ratio | PASS |
| ATK-01 | JPEG Compression | Assignment | Attack Lab | `backend/app/attacks/jpeg.py` | IO buffer quality param | PASS |
| ATK-02 | Crop | Assignment | Attack Lab | `backend/app/attacks/crop.py` | Margin crop to param | PASS |
| ATK-03 | Resize | Assignment | Attack Lab | `backend/app/attacks/resize.py` | Pil `resize()` | PASS |
| ATK-04 | Gaussian Noise | Assignment | Attack Lab | `backend/app/attacks/noise.py` | Numpy RNG scale/loc | PASS |
| ATK-05 | Brightness | Assignment | Attack Lab | `backend/app/attacks/color.py` | Float adjustment + clip | PASS |
| ATK-06 | Contrast | Assignment | Attack Lab | `backend/app/attacks/color.py` | Multiplier round to mean | PASS |
| DWT-01 | DWT Implementation | PRD | Comparison | `backend/app/watermark_dwt.py` | Empty file (Frozen) | NOT VERIFIED |
| UX-01 | E2E Web Interface | PRD | Frontend | `frontend/app/` | Smoke tests passing | PASS |
| UX-02 | Export Dataset | PRD | Results | `frontend/app/app/results/page.tsx` | CSV & JSON download | PASS |
