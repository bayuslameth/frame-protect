import requests
import base64
import csv
import time
import io
import shutil

BASE_URL = "http://localhost:8000/api"
TEST_KEY = "frame-test-123"
WRONG_KEY = "WRONG-KEY"
WATERMARK = "BAYU SLAMET HIDAYAT"
IMAGE_FILE = "test_image.jpg"
ORIGINAL_DEST = "docs/experiments/images/original/test_image.jpg"
WATERMARKED_DEST = "docs/experiments/images/watermarked/watermarked.png"
CSV_DEST = "docs/experiments/results/experiment_results.csv"

shutil.copy(IMAGE_FILE, ORIGINAL_DEST)

results = []

def save_b64_image(b64_data, path):
    if "," in b64_data:
        b64_data = b64_data.split(",")[1]
    with open(path, "wb") as f:
        f.write(base64.b64decode(b64_data))

print("[1] EMBEDDING...")
t0 = time.time()
with open(IMAGE_FILE, "rb") as f:
    r_embed = requests.post(f"{BASE_URL}/watermark/embed", files={"image": f}, data={
        "watermark_type": "text", "watermark_text": WATERMARK, "secret_key": TEST_KEY, "strength": 0.15, "dct_band": "mid"
    })
t1 = time.time()
embed_time = t1 - t0
res_embed = r_embed.json()
save_b64_image(res_embed['image'], WATERMARKED_DEST)
print(f"Embedding time: {embed_time:.3f}s")

print("[2] BASELINE VERIFICATION...")
with open(IMAGE_FILE, "rb") as orig, open(WATERMARKED_DEST, "rb") as wm:
    r_verify = requests.post(f"{BASE_URL}/metrics/verify", files={"original_image": orig, "watermarked_image": wm}, data={
        "watermark_type": "text", "watermark_text": WATERMARK, "secret_key": TEST_KEY
    })
metrics = r_verify.json()['metrics']
base_psnr = metrics['psnr']['value']
base_nc = metrics['nc']['value']
base_ber = metrics['ber']['value']

results.append({
    "Experiment ID": "EXP-01",
    "Attack": "BASELINE",
    "Parameter": "N/A",
    "Image Width": res_embed['metadata']['width'],
    "Image Height": res_embed['metadata']['height'],
    "PSNR": f"{base_psnr:.2f}",
    "NC": f"{base_nc:.4f}",
    "BER": f"{base_ber:.4f}",
    "Detection Status": "DETECTED",
    "Extracted Watermark": WATERMARK,
    "Notes": "Baseline embedding"
})

print("[3] WRONG KEY TEST...")
with open(WATERMARKED_DEST, "rb") as wm:
    r_wrong = requests.post(f"{BASE_URL}/watermark/detect", files={"image": wm}, data={"secret_key": WRONG_KEY})
ext_wrong = r_wrong.json().get("recovered_text")
print(f"Extracted with wrong key: '{ext_wrong}'")

attacks_to_test = [
    ("jpeg", 90), ("jpeg", 70), ("jpeg", 50),
    ("crop", 10), ("crop", 25),
    ("resize", 75), ("resize", 50),
    ("gaussian_noise", 5), ("gaussian_noise", 10), ("gaussian_noise", 20),
    ("brightness", -30), ("brightness", 30),
    ("contrast", 0.7), ("contrast", 1.0), ("contrast", 1.3)
]

exp_idx = 2
for at, p in attacks_to_test:
    print(f"Testing {at} {p}...")
    with open(IMAGE_FILE, "rb") as orig, open(WATERMARKED_DEST, "rb") as wm:
        r_atk = requests.post(f"{BASE_URL}/attacks/test", files={"original_image": orig, "watermarked_image": wm}, data={
            "attack_type": at, "parameter": p, "secret_key": TEST_KEY, "original_watermark_text": WATERMARK
        })
    atk_res = r_atk.json()
    save_b64_image(atk_res['attacked_image'], f"docs/experiments/images/attacked/attacked_{at}_{p}.png")
    
    psnr = atk_res.get('psnr')
    psnr_str = f"{psnr:.2f}" if psnr is not None else "N/A"
    
    nc = atk_res.get('nc', 0)
    ber_obj = atk_res.get('ber')
    ber = ber_obj.get('ber', 0) if isinstance(ber_obj, dict) else (ber_obj if ber_obj is not None else 0)
    
    results.append({
        "Experiment ID": f"EXP-{exp_idx:02d}",
        "Attack": at.upper(),
        "Parameter": str(p),
        "Image Width": atk_res['attacked_dimensions']['width'],
        "Image Height": atk_res['attacked_dimensions']['height'],
        "PSNR": psnr_str,
        "NC": f"{nc:.4f}",
        "BER": f"{ber:.4f}",
        "Detection Status": atk_res['extraction_status'],
        "Extracted Watermark": atk_res['extracted_watermark'] if atk_res['extracted_watermark'] else "[UNREADABLE]",
        "Notes": ""
    })
    exp_idx += 1

print("[4] SAVING CSV...")
with open(CSV_DEST, "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=results[0].keys())
    writer.writeheader()
    writer.writerows(results)

print("EXPERIMENTS COMPLETE.")
