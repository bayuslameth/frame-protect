import requests
import base64
import os
import numpy as np
from PIL import Image

API_BASE = "http://127.0.0.1:8000"

print("--- 1. REAL END-TO-END PHOTOGRAPH WATERMARKING TEST ---")
photo_path = "sample_photo.jpg"
assert os.path.exists(photo_path), "sample_photo.jpg not found!"

orig_img = Image.open(photo_path)
orig_w, orig_h = orig_img.size
orig_bytes = open(photo_path, "rb").read()
print(f"Source photograph: {photo_path} | Dimensions: {orig_w}x{orig_h} | File size: {len(orig_bytes)} bytes | Mode: {orig_img.mode}")

watermark_text = "BAYU SLAMET HIDAYAT"
secret_key = "CameraSecretKey2026"
strength = 0.15
dct_band = "mid"

# Step 1: POST /api/watermark/embed
print("\n--- 2. EMBED WATERMARK VIA POST /api/watermark/embed ---")
with open(photo_path, "rb") as f:
    files = {"image": ("sample_photo.jpg", f, "image/jpeg")}
    data = {
        "watermark_type": "text",
        "watermark_text": watermark_text,
        "secret_key": secret_key,
        "strength": strength,
        "dct_band": dct_band
    }
    resp = requests.post(f"{API_BASE}/api/watermark/embed", files=files, data=data)

assert resp.status_code == 200, f"Embed failed: {resp.status_code} {resp.text}"
embed_data = resp.json()
print("Embed Response Status:", resp.status_code)
print("Embed Success:", embed_data.get("success"))
print("Metadata returned:", embed_data.get("metadata"))
print("Image field format:", embed_data["image"][:40], "... [total length:", len(embed_data["image"]), "chars]")

# Step 2: Download / Extract the generated watermarked image
print("\n--- 3. VERIFY WATERMARKED IMAGE & DOWNLOAD SIMULATION ---")
assert embed_data["image"].startswith("data:image/png;base64,"), "Invalid image data URL"
base64_str = embed_data["image"].split("data:image/png;base64,")[1]
downloaded_bytes = base64.b64decode(base64_str)

download_filename = "frame-protect-watermarked.png"
with open(download_filename, "wb") as f:
    f.write(downloaded_bytes)

print(f"Downloaded file saved as: {download_filename} ({len(downloaded_bytes)} bytes)")

# Verify downloaded file opens correctly
downloaded_img = Image.open(download_filename)
dl_w, dl_h = downloaded_img.size
print(f"Downloaded image format: {downloaded_img.format}, size: {dl_w}x{dl_h}, mode: {downloaded_img.mode}")
assert dl_w == orig_w and dl_h == orig_h, f"Dimensions mismatch: original ({orig_w}x{orig_h}) vs downloaded ({dl_w}x{dl_h})"

# Verify pixel differences
orig_arr = np.array(orig_img.convert("RGB"))
dl_arr = np.array(downloaded_img.convert("RGB"))
diff = np.abs(orig_arr.astype(int) - dl_arr.astype(int))
num_diff_pixels = np.count_nonzero(diff.any(axis=-1))
total_pixels = orig_w * orig_h
diff_percentage = (num_diff_pixels / total_pixels) * 100
max_diff = np.max(diff)
mean_diff = np.mean(diff)

print(f"Pixel-level difference: {num_diff_pixels} / {total_pixels} pixels modified ({diff_percentage:.2f}%)")
print(f"Max subpixel difference: {max_diff} (out of 255)")
print(f"Mean subpixel difference: {mean_diff:.4f}")
assert num_diff_pixels > 0, "Watermarked image is identical to original (no watermark embedded)!"
assert not np.array_equal(open(photo_path, "rb").read(), downloaded_bytes), "Original was overwritten or identical!"

# Step 3: Verify Extraction via POST /api/watermark/detect
print("\n--- 4. VERIFY EXTRACTION VIA POST /api/watermark/detect ---")
# With correct key
with open(download_filename, "rb") as f:
    resp_detect = requests.post(
        f"{API_BASE}/api/watermark/detect",
        files={"image": (download_filename, f, "image/png")},
        data={"secret_key": secret_key}
    )
assert resp_detect.status_code == 200, f"Detect failed: {resp_detect.status_code} {resp_detect.text}"
detect_data = resp_detect.json()
extracted_text_correct = detect_data.get("recovered_text")
print(f"Extracted Watermark (correct key '{secret_key}'): '{extracted_text_correct}'")
assert extracted_text_correct == watermark_text, f"Extracted text mismatch! Expected '{watermark_text}', got '{extracted_text_correct}'"

# With wrong key
wrong_key = "WrongKey_XYZ_999"
with open(download_filename, "rb") as f:
    resp_detect_wrong = requests.post(
        f"{API_BASE}/api/watermark/detect",
        files={"image": (download_filename, f, "image/png")},
        data={"secret_key": wrong_key}
    )
assert resp_detect_wrong.status_code == 200, f"Detect with wrong key failed: {resp_detect_wrong.status_code} {resp_detect_wrong.text}"
detect_wrong_data = resp_detect_wrong.json()
extracted_text_wrong = detect_wrong_data.get("recovered_text")
print(f"Extracted Watermark (wrong key '{wrong_key}'): '{extracted_text_wrong}'")
assert extracted_text_wrong != watermark_text, "Wrong key unexpectedly extracted watermark!"

# Step 4: Verify Metrics via POST /api/metrics/verify
print("\n--- 5. VERIFY METRICS VIA POST /api/metrics/verify ---")
with open(photo_path, "rb") as f_orig, open(download_filename, "rb") as f_wm:
    resp_verify = requests.post(
        f"{API_BASE}/api/metrics/verify",
        files={
            "original_image": (photo_path, f_orig, "image/jpeg"),
            "watermarked_image": (download_filename, f_wm, "image/png")
        },
        data={
            "watermark_type": "text",
            "watermark_text": watermark_text,
            "secret_key": secret_key
        }
    )

assert resp_verify.status_code == 200, f"Verify failed: {resp_verify.status_code} {resp_verify.text}"
verify_data = resp_verify.json()
metrics = verify_data["metrics"]
psnr = metrics["psnr"]["value"]
nc = metrics["nc"]["value"]
ber = metrics["ber"]["value"]
error_bits = metrics["ber"]["error_bits"]
total_bits = metrics["ber"]["total_bits"]
recovered_text_verify = verify_data.get("recovered_text")

print(f"Extracted Watermark from verify: '{recovered_text_verify}'")
print(f"PSNR: {psnr:.4f} dB")
print(f"NC: {nc:.6f}")
print(f"BER: {ber:.6f} ({error_bits} errors / {total_bits} total bits)")

print("\n--- ALL REAL API CHECKS PASSED SUCCESSFULLY ---")
