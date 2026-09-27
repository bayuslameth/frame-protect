# Evaluation Metrics

## 1. Peak Signal-to-Noise Ratio (PSNR)
- **Purpose**: Measures the visual fidelity (imperceptibility) of the watermarked image relative to the original image.
- **Formula**: $PSNR = 10 \cdot \log_{10}(255^2 / MSE)$
- **Implementation**: Defined in `backend/app/metrics/psnr.py`. If MSE is 0 (images are identical), the function returns `inf` or N/A.

## 2. Normalized Correlation (NC)
- **Purpose**: Measures the similarity between the original watermark payload and the extracted payload.
- **Formula**: $NC = \frac{\sum (W_1 \cdot W_2)}{\sqrt{\sum(W_1^2) \cdot \sum(W_2^2)}}$
- **Note**: Bits (0,1) are mapped to a bipolar representation (-1, 1) before calculation to yield mathematically meaningful correlation.
- **Implementation**: Defined in `backend/app/metrics/nc.py`.

## 3. Bit Error Rate (BER)
- **Purpose**: Calculates the proportion of incorrect bits in the extracted watermark.
- **Formula**: $BER = \frac{	ext{Error Bits}}{	ext{Total Bits}}$
- **Implementation**: Defined in `backend/app/metrics/ber.py`.