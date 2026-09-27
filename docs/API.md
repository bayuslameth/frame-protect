# API Documentation

All endpoints are hosted locally on `http://127.0.0.1:8000/api`.

## `POST /api/watermark/embed`
- **Purpose**: Embeds a watermark into a source image.
- **Request**: `multipart/form-data` (image file, watermark_text, secret_key, strength, dct_band).
- **Response**: Base64 encoded image and configuration metadata.

## `POST /api/watermark/detect`
- **Purpose**: Extracts a payload from a watermarked image.
- **Request**: `multipart/form-data` (image file, secret_key, optional original_watermark_text).
- **Response**: Extracted string. If `original_watermark_text` is provided, includes NC and BER.

## `POST /api/metrics/verify`
- **Purpose**: Generates baseline PSNR, NC, and BER between original and watermarked frames.
- **Request**: `multipart/form-data` (original_image, watermarked_image, watermark_text, secret_key).
- **Response**: PSNR, NC, and BER dictionaries.

## `POST /api/attacks/test`
- **Purpose**: Applies a specific attack and immediately attempts extraction.
- **Request**: `multipart/form-data` (original_image, watermarked_image, attack_type, parameter, secret_key, original_watermark_text).
- **Response**: Attacked image base64, extraction status, PSNR, NC, BER.