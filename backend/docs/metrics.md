# FRAME PROTECT — Metrics & Verification

## Overview
This document describes the Phase 5 implementation of quantitative watermarking metrics. The metrics verify the structural fidelity of the image embedding and the accuracy of the extracted payload bits.

## 1. Peak Signal-to-Noise Ratio (PSNR)
**What it measures:** 
Evaluates the pixel-level fidelity (imperceptibility) between the original image and the watermarked output. A higher PSNR generally indicates fewer visible artifacts.

**Inputs:**
- Original Image ($I$)
- Watermarked Image ($K$)

**Mathematical Basis:**
1. Mean Squared Error (MSE): Calculates the average squared difference between the reference and distorted pixel values.
2. PSNR = $10 \cdot \log_{10} \left( \frac{MAX^2}{MSE} \right)$ where $MAX = 255$ for standard 8-bit images.
3. If MSE is 0 (identical images), PSNR is mathematically infinite ($\infty$).

## 2. Normalized Correlation (NC)
**What it measures:** 
Evaluates the similarity between the original watermark payload and the extracted watermark sequence. Highly correlated sequences approach `1.0`.

**Inputs:**
- Original bits sequence ($W$)
- Extracted bits sequence ($W'$)

**Mathematical Basis:**
The binary payload `[0, 1]` is mathematically mapped to a bipolar representation `[-1, 1]` before calculating the dot product over the magnitude product. This standardizes the metric into the rigorous `[-1, 1]` interval.

## 3. Bit Error Rate (BER)
**What it measures:**
A direct measurement of how many payload bits were corrupted or flipped during embedding/extraction. 

**Inputs:**
- Original bits sequence ($W$)
- Extracted bits sequence ($W'$)

**Mathematical Basis:**
$BER = \frac{N_{errors}}{N_{total}}$, where $N_{errors}$ represents mismatched indices between $W$ and $W'$. 

## Endpoints
- `POST /api/metrics/verify`: Provides an all-in-one verification pipeline calculating PSNR natively over the generated image matrices and dynamically extracting payload bits internally to score NC and BER efficiently.
