# Phase 6: Attack Lab & Robustness Testing

## Purpose
The Attack Lab evaluates the robustness of the invisible DCT watermark against common digital image transformations and distortions. It operates on the principle of experimental measurement, applying actual transformations to the watermarked image and attempting extraction to observe degradation in PSNR, NC, and BER.

## Supported Attacks

### JPEG Compression
Uses Pillow to apply lossy JPEG compression.
- **Parameters**: Q90, Q70, Q50
- **Behavior**: Quantizes high-frequency DCT coefficients, typically testing the watermark's survivability in mid-frequency bands.

### Crop
Applies deterministic centered cropping.
- **Parameters**: 10%, 25% (percentage of dimensions removed from edges)
- **Behavior**: Reduces image dimensions. Extraction requires the attacked image to retain at least one 8x8 block. If dimensions are too small, extraction fails.

### Resize
Uses high-quality LANCZOS resampling.
- **Parameters**: 75%, 50%
- **Behavior**: Scales down the image, reducing dimensions. This destroys spatial alignment and frequency characteristics, aggressively challenging the fixed 8x8 DCT grid extraction.

### Gaussian Noise
Uses NumPy to add normally distributed noise.
- **Parameters**: σ5, σ10, σ20
- **Behavior**: Simulates sensor noise or atmospheric interference. Evaluates the signal-to-noise ratio threshold at which the payload becomes unrecoverable.
- **Deterministic Tests**: For automated integration testing, the random seed `42` is fixed to ensure reproducible results.

### Brightness
Uses `ImageEnhance.Brightness` from Pillow.
- **Parameters**: -30 (0.7x), +30 (1.3x)
- **Behavior**: Scales pixel intensities. As DCT is a linear transform, uniform brightness scaling generally preserves mid-frequency relative magnitudes unless clipping occurs.

### Contrast
Uses `ImageEnhance.Contrast` from Pillow.
- **Parameters**: 0.7, 1.0 (baseline), 1.3
- **Behavior**: Spreads or compresses the intensity histogram. 1.0 represents the identical original signal.

## Dimensions Behavior
The Attack Lab preserves the real output dimensions of transformations. Crop and Resize attacks explicitly change `attacked_dimensions`. The PSNR metric requires identical spatial dimensions; therefore, it is recorded as `null`/`N/A` for dimension-altering attacks.

## Extraction Behavior
The system runs the existing Phase 5 DCT extraction process on the attacked frame. If the image dimensions drop below the 8x8 block requirement, extraction fails immediately. Otherwise, it extracts up to the original payload length.

## Methodology

### Baseline vs Attack
Every attack begins independently from the *Watermarked Baseline* image. The lab measures the delta between the baseline extraction and the post-attack extraction. Attacks are not chained by default.

### PSNR
Calculated as the peak signal-to-noise ratio between the **Watermarked Image** and the **Attacked Image**. (Note: Phase 5 calculated PSNR between Original and Watermarked. The Attack Lab calculates the degradation introduced solely by the attack). 

### NC (Normalized Correlation)
Calculated between the **Original Watermark Bits** and the **Extracted Watermark Bits**. Missing bits due to reduced dimensions are padded with zeros to ensure a fair penalty to the correlation score.

### BER (Bit Error Rate)
Calculated as the percentage of mismatched bits between the **Original Watermark Bits** and the **Extracted Watermark Bits**.

## Limitations
1. Geometric attacks (rotation, shearing, aggressive cropping) easily destroy the simplistic 8x8 DCT alignment, as this implementation lacks a synchronization template.
2. Large image processing is supported in-memory (e.g., 7952 × 5304 files ~24MB) but may briefly consume substantial RAM during array conversion.
3. Batch testing was deferred to prioritize isolated attack stability.
