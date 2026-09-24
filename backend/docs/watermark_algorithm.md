# FRAME PROTECT — Digital Watermarking Algorithm

## Overview
This document describes the Phase 4 Discrete Cosine Transform (DCT) watermarking engine. The implementation embeds text payloads seamlessly into standard RGB images by modifying mid-frequency elements of the image's frequency domain.

## Algorithm Pipeline

### 1. Payload Preparation
The string payload is converted to binary with a header layout:
`[MAGIC (16 bits)] [VERSION (8 bits)] [LENGTH (32 bits)] [PAYLOAD_BITS]`
This ensures the exact length can be reconstructed by the extractor safely.

### 2. Block Selection & Cryptographic Seeding
To prevent trivial detection and destruction, the watermark bits are mapped to random 8x8 blocks of the image.
1. The user's `secret_key` is passed through SHA-256.
2. The hash acts as a deterministic seed for a standard Pseudo-Random Number Generator (PRNG).
3. The PRNG uniformly shuffles the index sequence corresponding to all available 8x8 spatial blocks in the image.
4. Only the exact number of bits requested are modified according to the generated index chain. The exact sequence is impossible to reproduce without the matching secret key.

### 3. Spatial-to-Frequency Conversion (DCT-II)
For every designated 8x8 block:
1. The RGB image is converted to `YCbCr` color space. Only the `Y` (Luminance) channel is adjusted to limit visual artifacts.
2. The block matrix is level-shifted by -128 to center the values.
3. The 2D DCT (Discrete Cosine Transform) matrix multiplication is applied: $D = C \times B \times C^T$, resulting in a coefficient matrix where the top-left represents low frequency and bottom-right represents high frequency.

### 4. Mid-Frequency Coefficient Embedding
To embed a single bit without degrading the image (high frequencies are easily destroyed by JPEG compression, and low frequencies cause visible blocking), two mid-frequency coefficients are selected:
- $C_1$ at `(u=4, v=5)`
- $C_2$ at `(u=5, v=4)`

**Embedding Rules:**
- **Bit 1**: Ensures $|C_1| \ge |C_2| + \text{margin}$.
- **Bit 0**: Ensures $|C_2| \ge |C_1| + \text{margin}$.

If the natural magnitudes do not satisfy the condition, their magnitudes are artificially widened from their average until the gap meets the required `margin`. The margin is driven by the user's `strength` configuration variable.

### 5. Reconstruction & Clipping (IDCT-II)
After the modification:
1. The IDCT is performed: $B = C^T \times D \times C$.
2. The +128 level shift is applied back.
3. The block is rounded and clipped strictly to the `[0, 255]` boundary.
4. The modified Luminance block is merged back with the original `Cb` and `Cr` channels and converted to an RGB uint8 image.

### 6. Extraction Process
The extraction process mirrors the embedding blindly without the original source image:
1. The deterministic PRNG uses the known `secret_key` to trace the embedded blocks.
2. The DCT is performed on those blocks.
3. The magnitude relationship is read: if $|C_1| > |C_2|$, the bit is `1`, otherwise it is `0`.
4. The payload header is unpacked dynamically to read the termination bounds, producing the original payload string.
