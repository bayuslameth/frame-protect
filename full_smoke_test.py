import requests

BASE_URL = "http://localhost:8000/api"
TEST_KEY = "frame-test-123"
WATERMARK = "BAYU SLAMET HIDAYAT"

print("\n[5] ATTACK LAB...")
attacks_to_test = [
    ("jpeg", 90),
    ("jpeg", 70),
    ("jpeg", 50),
    ("crop", 10),
    ("resize", 75),
    ("gaussian_noise", 10),
    ("brightness", 30),
    ("contrast", 1.3)
]

for at, p in attacks_to_test:
    with open("test_image.jpg", "rb") as orig, open("watermarked.png", "rb") as wm:
        r_atk = requests.post(f"{BASE_URL}/attacks/test", files={"original_image": orig, "watermarked_image": wm}, data={
            "attack_type": at, "parameter": p, "secret_key": TEST_KEY, "original_watermark_text": WATERMARK
        })
    if r_atk.status_code != 200:
        print(f"FAIL: Attack {at}({p}) returned {r_atk.status_code}")
    else:
        atk_res = r_atk.json()
        nc = atk_res.get('nc', 0)
        ber_obj = atk_res.get('ber')
        ber = ber_obj.get('ber', 0) if isinstance(ber_obj, dict) else (ber_obj if ber_obj is not None else 0)
        print(f"PASS: {at}({p}) -> NC: {nc:.4f}, BER: {ber:.4f}")

