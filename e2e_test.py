import requests
import base64
import os

url_embed = "http://localhost:8000/api/watermark/embed"
url_detect = "http://localhost:8000/api/watermark/detect"
url_verify = "http://localhost:8000/api/metrics/verify"

# 1. Embed
with open("test_image.jpg", "rb") as f:
    files = {"image": f}
    data = {
        "watermark_type": "text",
        "watermark_text": "BAYU SLAMET HIDAYAT",
        "secret_key": "mysecret",
        "strength": 0.15,
        "dct_band": "mid"
    }
    r = requests.post(url_embed, files=files, data=data)

if r.status_code != 200:
    print("Embed Failed:", r.text)
    exit(1)

res = r.json()
print("Embed Success. Blocks used:", res['metadata']['blocks_used'])

# Extract base64 image
b64_data = res['image'].split(",")[1]
with open("watermarked.png", "wb") as f:
    f.write(base64.b64decode(b64_data))
print("Saved watermarked.png")

# 2. Extract
with open("watermarked.png", "rb") as f:
    r2 = requests.post(url_detect, files={"image": f}, data={"secret_key": "mysecret"})

if r2.status_code != 200:
    print("Detect Failed:", r2.text)
    exit(1)
    
res2 = r2.json()
print("Extracted Text:", res2['watermark_text'])

# 3. Verify
with open("test_image.jpg", "rb") as f1:
    with open("watermarked.png", "rb") as f2:
        r3 = requests.post(url_verify, files={"original_image": f1, "watermarked_image": f2}, data={
            "watermark_type": "text",
            "watermark_text": "BAYU SLAMET HIDAYAT",
            "secret_key": "mysecret"
        })

if r3.status_code != 200:
    print("Verify Failed:", r3.text)
    exit(1)

res3 = r3.json()
print(f"Metrics: PSNR={res3['metrics']['psnr']['value']}, NC={res3['metrics']['nc']['value']}, BER={res3['metrics']['ber']['value']}")
