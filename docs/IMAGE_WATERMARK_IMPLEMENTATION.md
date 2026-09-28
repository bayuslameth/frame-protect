# IMAGE / LOGO WATERMARK IMPLEMENTATION

## 1. Overview
The FRAME PROTECT system has been extended to support **Image / Logo Watermarks** alongside the existing text watermark implementation. The new logic securely embeds a binary logo into the mid-frequency DCT coefficients of a host image, retaining identical workflow structures.

## 2. Payload Format & Handling
When `watermark_type=logo` is selected, the logo image is converted into a deterministic binary bitstream:
1. **Grayscale Conversion**: The logo is converted to 8-bit grayscale (`L` mode).
2. **Binarization**: The image is thresholded at 128 to generate a purely 1-bit binary image array.
3. **Capacity check**: Maximum allowed pixels are calculated via: `Total host blocks - 56 bits (header)`.
4. **Dynamic Resizing**: If the logo exceeds the capacity threshold, it is proportionally downscaled via Lanczos resampling so that it completely fits within the host image's maximum allowed block limit.
5. **Header Injection**: A 7-byte header is prepended to the bitstream:
   - Magic String `FI` (2 bytes)
   - Version `1` (1 byte)
   - Dimensions: Width (2 bytes) + Height (2 bytes)
6. **Flattening**: The final matrix is flattened into a 1D bit array.

## 3. DCT Embedding & Extraction
The underlying DCT injection remains identical to text watermarking:
- **Seed**: Derived cleanly from `secret_key` via SHA-256 to ensure pseudo-random deterministic block selection.
- **Embedding**: Modifies the relationship between the (4,5) and (5,4) coordinates of the 8x8 spatial DCT.
- **Extraction**: Reads all possible blocks across the host grid (capped at theoretical max), parsing the first 56 bits. If `FI` is discovered, it dynamically decodes the payload width and height, halting extraction accurately without overflowing.

## 4. Metrics Validation
- **Normalized Correlation (NC)**: Calculates structural similarity directly against the 1D binary vectors of the origin logo versus the extracted logo.
- **Bit Error Rate (BER)**: Accurately checks binary fidelity prior to image reconstruction.
- **Mismatch Tolerance**: Using an incorrect key yields a disorganized 56-bit header, failing the `FI` magic byte check and returning an explicit "NO VALID PAYLOAD DETECTED" instead of a hallucinatory or malformed pseudo-image.

## 5. UI Integration
- Added logo upload input into `WatermarkConfigPanel`.
- Prevented UI from improperly rendering image payloads as binary strings.
- Explicitly renders the `extracted_logo` as a visual base64 component in both the Protect baseline verification UI and the standalone Detect workflow.
- Detect page allows supplying a Reference Logo alongside the candidate image to correctly compute `NC` and `BER` against attacked outputs.

## 6. Test Suite
Verified via `backend/tests/test_logo_watermark.py`:
- [x] Logo payload encoding/decoding logic (`FI` headers & dimensions).
- [x] Implicit Capacity Scaling.
- [x] E2E Embed & Detect logic checking HTTP payload transfers.
- [x] Deliberate failure on Wrong Keys.
- [x] Text Regression (verified via `test_watermark.py`).

## 7. Files Changed
- `backend/app/api/watermark.py`
- `backend/app/api/metrics.py`
- `backend/app/watermark/payload.py`
- `backend/tests/test_logo_watermark.py`
- `frontend/services/api/watermark.service.ts`
- `frontend/services/api/metrics.service.ts`
- `frontend/components/watermark/watermark-config-panel.tsx`
- `frontend/app/app/protect/page.tsx`
- `frontend/app/app/detect/page.tsx`
