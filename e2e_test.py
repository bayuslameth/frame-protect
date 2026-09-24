import requests
import base64

url_embed = "http://localhost:8000/api/watermark/embed"
url_detect = "http://localhost:8000/api/watermark/detect"
url_verify = "http://localhost:8000/api/metrics/verify"

with open("watermarked.png", "rb") as f:
    r2 = requests.post(url_detect, files={"image": f}, data={"secret_key": "mysecret"})
res2 = r2.json()
print("Extract Response:", res2)

with open("test_image.jpg", "rb") as f1:
    with open("watermarked.png", "rb") as f2:
        r3 = requests.post(url_verify, files={"original_image": f1, "watermarked_image": f2}, data={
            "watermark_type": "text",
            "watermark_text": "BAYU SLAMET HIDAYAT",
            "secret_key": "mysecret"
        })
res3 = r3.json()
print(f"Metrics: PSNR={res3['metrics']['psnr']['value']}, NC={res3['metrics']['nc']['value']}, BER={res3['metrics']['ber']['value']}")
