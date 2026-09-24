import requests
import base64
import numpy as np
from PIL import Image
import io
import time
import os

API_URL = "http://localhost:8000"

def test_workflow():
    print("Testing End-to-End Workflow")
    
    # 1. Load Original Image
    if not os.path.exists("sample_photo.jpg"):
        print("Creating dummy image")
        img = Image.fromarray(np.random.randint(0, 255, (500, 500, 3), dtype=np.uint8))
        img.save("sample_photo.jpg")

    print(f"Original image size: {os.path.getsize('sample_photo.jpg')} bytes")
    
    # 2. Embed Watermark
    with open("sample_photo.jpg", "rb") as f:
        files = {"image": ("sample_photo.jpg", f, "image/jpeg")}
        data = {
            "watermark_type": "text",
            "watermark_text": "BAYU SLAMET HIDAYAT",
            "secret_key": "mysecretkey",
            "strength": "0.15",
            "dct_band": "mid"
        }
        print("Calling /api/watermark/embed...")
        r = requests.post(f"{API_URL}/api/watermark/embed", files=files, data=data)
        
    if r.status_code != 200:
        print("Embed failed:", r.text)
        return
        
    res = r.json()
    print("Embed Success:", res["success"])
    
    # 3. Save Watermarked Image (Simulate Download)
    data_url = res["image"]
    base64_str = data_url.split(",")[1]
    img_data = base64.b64decode(base64_str)
    
    with open("frame-protect-watermarked.png", "wb") as f:
        f.write(img_data)
        
    print(f"Watermarked image saved: frame-protect-watermarked.png ({len(img_data)} bytes)")
    
    # Verify they are different
    orig = Image.open("sample_photo.jpg").convert("RGB")
    wm = Image.open("frame-protect-watermarked.png").convert("RGB")
    diff = np.sum(np.abs(np.array(orig, dtype=np.int16) - np.array(wm, dtype=np.int16)))
    print(f"Absolute pixel difference sum: {diff}")
    
    # 4. Extract Watermark
    with open("frame-protect-watermarked.png", "rb") as f:
        files = {"image": ("frame-protect-watermarked.png", f, "image/png")}
        data = {"secret_key": "mysecretkey"}
        print("Calling /api/watermark/detect...")
        r = requests.post(f"{API_URL}/api/watermark/detect", files=files, data=data)
        
    res2 = r.json()
    print("Extracted watermark:", res2.get("recovered_text"))
    
    # 5. Extract with wrong key
    with open("frame-protect-watermarked.png", "rb") as f:
        files = {"image": ("frame-protect-watermarked.png", f, "image/png")}
        data = {"secret_key": "wrongkey"}
        print("Calling /api/watermark/detect (wrong key)...")
        r = requests.post(f"{API_URL}/api/watermark/detect", files=files, data=data)
        
    res3 = r.json()
    print("Extracted watermark (wrong key):", res3.get("recovered_text"))

    # 6. Verify Metrics
    with open("sample_photo.jpg", "rb") as f1, open("frame-protect-watermarked.png", "rb") as f2:
        files = {
            "original_image": ("sample_photo.jpg", f1, "image/jpeg"),
            "watermarked_image": ("frame-protect-watermarked.png", f2, "image/png")
        }
        data = {
            "watermark_type": "text",
            "watermark_text": "BAYU SLAMET HIDAYAT",
            "secret_key": "mysecretkey"
        }
        print("Calling /api/metrics/verify...")
        r = requests.post(f"{API_URL}/api/metrics/verify", files=files, data=data)
        
    res4 = r.json()
    print("Metrics:")
    print(f"PSNR: {res4['metrics']['psnr']['value']}")
    print(f"NC: {res4['metrics']['nc']['value']}")
    print(f"BER: {res4['metrics']['ber']['value']}")

if __name__ == '__main__':
    time.sleep(2) # wait for server
    test_workflow()
