# Attack Lab Configurations

The Attack Lab subjects watermarked images to signal degradations to test the robustness of the DCT embedding.

## Available Attacks

### 1. JPEG Compression
- **Method**: In-memory `io.BytesIO` buffer compression via Pillow.
- **Parameters**: Quality factor `Q` (90, 70, 50).
- **Purpose**: Tests lossy compression survival.

### 2. Cropping
- **Method**: Symmetrical removal of outer pixels.
- **Parameters**: `10%`, `25%`.
- **Purpose**: Tests geometric robustness and spatial indexing survival.

### 3. Resize (Scaling)
- **Method**: Pillow affine resizing.
- **Parameters**: `75%`, `50%`.
- **Purpose**: Tests low-pass filtering and dimension alteration survival.

### 4. Gaussian Noise
- **Method**: Addition of normal distribution noise via NumPy RNG.
- **Parameters**: Standard deviation `sigma` (5, 10, 20).
- **Purpose**: Tests additive noise robustness.

### 5. Brightness
- **Method**: Linear shift applied to pixel channels.
- **Parameters**: Delta `-30`, `+30`.
- **Purpose**: Tests global illumination variation.

### 6. Contrast
- **Method**: Linear scale around the mean pixel value.
- **Parameters**: Factor `0.7`, `1.0`, `1.3`.
- **Purpose**: Tests dynamic range compression/expansion survival.