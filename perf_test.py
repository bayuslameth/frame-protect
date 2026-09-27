import requests
import time
from PIL import Image, ImageDraw
import io

# Create 2048x1366 image
img = Image.new('RGB', (2048, 1366), color = (73, 109, 137))
img_io = io.BytesIO()
img.save(img_io, format='JPEG')
img_io.seek(0)

BASE_URL = "http://localhost:8000/api"

# Embed
t0 = time.time()
r_embed = requests.post(f"{BASE_URL}/watermark/embed", files={"image": ("large.jpg", img_io, "image/jpeg")}, data={
    "watermark_type": "text", "watermark_text": "PERFORMANCE TEST WATERMARK", "secret_key": "perf-key", "strength": 0.15, "dct_band": "mid"
})
t1 = time.time()

if r_embed.status_code != 200:
    print("Embed Failed")
else:
    print(f"Embed Time: {t1 - t0:.3f} s")

# Detect
import base64
b64 = r_embed.json()['image'].split(",")[1]
wm_io = io.BytesIO(base64.b64decode(b64))

t2 = time.time()
r_detect = requests.post(f"{BASE_URL}/watermark/detect", files={"image": ("wm.png", wm_io, "image/png")}, data={
    "secret_key": "perf-key"
})
t3 = time.time()

if r_detect.status_code != 200:
    print("Detect Failed")
else:
    print(f"Detect Time: {t3 - t2:.3f} s")
