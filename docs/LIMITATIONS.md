# Technical Limitations

## 1. Geometric Attacks (Crop & Resize)
The current DCT block-partitioning algorithm relies on absolute spatial indexing (top-left aligned 8x8 blocks). Consequently, geometric shifts like Cropping and non-integer Scaling permanently misalign the grid indexing relative to the embedded blocks. This drastically drops Normalized Correlation (NC), not due to payload destruction, but due to grid synchronization failure.

## 2. File Format Preservation
The system transports processed files as PNG (lossless) to preserve delicate DCT alterations. If users save the watermarked result directly as a highly compressed JPEG, extraction will be hampered before manual attack testing even begins.

## 3. DWT Comparison Frozen
As per technical freezes, DWT modules exist in the codebase architecture as stubs but are not implemented, leaving the system strictly focused on providing an isolated empirical baseline for DCT-II.