import requests
import numpy as np
from PIL import Image
import os
import time

print("Creating large image...")
# 7952 x 5304
img = Image.fromarray(np.random.randint(0, 255, (5304, 7952, 3), dtype=np.uint8))
img.save("large_photo.jpg")
print(f"Large image size: {os.path.getsize('large_photo.jpg') / (1024*1024):.2f} MB")

with open("large_photo.jpg", "rb") as f:
    files = {"image": ("large_photo.jpg", f, "image/jpeg")}
    data = {
        "watermark_type": "text",
        "watermark_text": "LARGE IMAGE TEST",
        "secret_key": "mysecretkey",
        "strength": "0.15",
        "dct_band": "mid"
    }
    print("Calling /api/watermark/embed for large image...")
    start = time.time()
    try:
        r = requests.post("http://localhost:8000/api/watermark/embed", files=files, data=data)
        end = time.time()
        print(f"Status: {r.status_code}")
        print(f"Time: {end - start:.2f} seconds")
        if r.status_code == 200:
            print("Success")
        else:
            print(f"Error: {r.text[:500]}")
    except Exception as e:
        print(f"Exception: {e}")
