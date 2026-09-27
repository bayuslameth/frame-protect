import requests
import base64

url_embed = "http://localhost:8000/api/watermark/embed"
url_detect = "http://localhost:8000/api/watermark/detect"
url_verify = "http://localhost:8000/api/metrics/verify"

TEST_KEY = "frame-test-123"
WRONG_KEY = "WRONG-KEY"
WATERMARK = "BAYU SLAMET HIDAYAT"

# 1. Embed
with open("test_image.jpg", "rb") as f:
    files = {"image": f}
    data = {
        "watermark_type": "text",
        "watermark_text": WATERMARK,
        "secret_key": TEST_KEY,
        "strength": 0.15,
        "dct_band": "mid"
    }
    r = requests.post(url_embed, files=files, data=data)

if r.status_code != 200:
    print("EMBED FAIL:", r.text)
    exit(1)
print("EMBED: PASS")

res = r.json()
b64_data = res['image'].split(",")[1]
with open("watermarked.png", "wb") as f:
    f.write(base64.b64decode(b64_data))
print("WATERMARKED IMAGE: PASS (saved watermarked.png)")

# 2. Detect (Correct Key)
with open("watermarked.png", "rb") as f:
    r2 = requests.post(url_detect, files={"image": f}, data={
        "secret_key": TEST_KEY,
        "original_watermark_text": WATERMARK
    })

if r2.status_code != 200:
    print("DETECT API FAIL:", r2.text)
    exit(1)
print("DETECT API: PASS")

res2 = r2.json()
print("EXTRACTION: PASS" if res2.get('recovered_text') == WATERMARK else "EXTRACTION: FAIL")
print("EXTRACTED:", res2.get('recovered_text'))
print("NC:", res2.get('nc'))
print("BER:", res2.get('ber'))

# 3. Detect (Wrong Key)
with open("watermarked.png", "rb") as f:
    r_wrong = requests.post(url_detect, files={"image": f}, data={"secret_key": WRONG_KEY})

print("WRONG KEY TEST: PASS" if r_wrong.json().get('recovered_text') != WATERMARK else "WRONG KEY TEST: FAIL")

