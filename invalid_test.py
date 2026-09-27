import requests

BASE_URL = "http://localhost:8000/api"

# 1. No image
r1 = requests.post(f"{BASE_URL}/watermark/embed", data={"watermark_type": "text", "watermark_text": "A", "secret_key": "B"})
print("No image:", r1.status_code, r1.text)

# 2. Invalid image
with open("invalid_test.py", "rb") as f:
    r2 = requests.post(f"{BASE_URL}/watermark/embed", files={"image": f}, data={"watermark_type": "text", "watermark_text": "A", "secret_key": "B"})
print("Invalid image:", r2.status_code, r2.text)

# 3. Empty watermark
with open("test_image.jpg", "rb") as f:
    r3 = requests.post(f"{BASE_URL}/watermark/embed", files={"image": f}, data={"watermark_type": "text", "watermark_text": "", "secret_key": "B"})
print("Empty watermark:", r3.status_code, r3.text)

# 4. Empty key
with open("test_image.jpg", "rb") as f:
    r4 = requests.post(f"{BASE_URL}/watermark/embed", files={"image": f}, data={"watermark_type": "text", "watermark_text": "A", "secret_key": ""})
print("Empty key:", r4.status_code, r4.text)

