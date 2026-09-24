import pytest
from fastapi.testclient import TestClient
from app.main import app
import numpy as np
from PIL import Image
import io

client = TestClient(app)

def create_test_image(width=64, height=64):
    img_array = np.random.randint(0, 255, (height, width, 3), dtype=np.uint8)
    pil_img = Image.fromarray(img_array)
    out = io.BytesIO()
    pil_img.save(out, format="PNG")
    out.seek(0)
    return out, img_array

def test_attack_test_jpeg():
    img_out, _ = create_test_image()
    
    # We use a dummy watermarked image (random noise). The extraction will likely be garbage, but it should complete.
    response = client.post(
        "/api/attacks/test",
        data={
            "attack_type": "jpeg",
            "parameter": 90,
            "original_watermark_text": "TEST",
            "secret_key": "testkey"
        },
        files={"watermarked_image": ("test.png", img_out, "image/png")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["attack_type"] == "jpeg"
    assert data["parameter"] == 90
    assert data["extraction_status"] == "DETECTED"
    assert "psnr" in data
    assert "nc" in data
    assert "ber" in data

def test_attack_test_crop():
    img_out, _ = create_test_image(128, 128)
    
    response = client.post(
        "/api/attacks/test",
        data={
            "attack_type": "crop",
            "parameter": 10,
            "original_watermark_text": "TEST",
            "secret_key": "testkey"
        },
        files={"watermarked_image": ("test.png", img_out, "image/png")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["original_dimensions"]["width"] == 128
    # PSNR should be None because dimensions changed
    assert data["psnr"] is None
    # Extraction should work since 10% crop of 128 is 115 > 8
    assert data["extraction_status"] == "DETECTED"

def test_attack_invalid_param():
    img_out, _ = create_test_image()
    response = client.post(
        "/api/attacks/test",
        data={
            "attack_type": "jpeg",
            "parameter": 99,
            "original_watermark_text": "TEST",
            "secret_key": "testkey"
        },
        files={"watermarked_image": ("test.png", img_out, "image/png")}
    )
    assert response.status_code == 400

def test_attack_test_resize():
    img_out, _ = create_test_image(128, 128)
    for p in [75, 50]:
        # need to reset pointer for img_out for multiple reads
        img_out.seek(0)
        response = client.post("/api/attacks/test", data={"attack_type": "resize", "parameter": p, "original_watermark_text": "TEST", "secret_key": "testkey"}, files={"watermarked_image": ("test.png", img_out, "image/png")})
        assert response.status_code == 200
        data = response.json()
        assert data["psnr"] is None
        assert data["extraction_status"] == "DETECTED"

def test_attack_test_noise():
    img_out, _ = create_test_image(64, 64)
    for p in [5, 10, 20]:
        img_out.seek(0)
        response = client.post("/api/attacks/test", data={"attack_type": "gaussian_noise", "parameter": p, "original_watermark_text": "TEST", "secret_key": "testkey"}, files={"watermarked_image": ("test.png", img_out, "image/png")})
        assert response.status_code == 200
        data = response.json()
        assert data["psnr"] is not None
        assert data["extraction_status"] == "DETECTED"

def test_attack_test_brightness():
    img_out, _ = create_test_image(64, 64)
    for p in [-30, 30]:
        img_out.seek(0)
        response = client.post("/api/attacks/test", data={"attack_type": "brightness", "parameter": p, "original_watermark_text": "TEST", "secret_key": "testkey"}, files={"watermarked_image": ("test.png", img_out, "image/png")})
        assert response.status_code == 200
        data = response.json()
        assert data["psnr"] is not None
        assert data["extraction_status"] == "DETECTED"

def test_attack_test_contrast():
    img_out, _ = create_test_image(64, 64)
    for p in [0.7, 1.0, 1.3]:
        img_out.seek(0)
        response = client.post("/api/attacks/test", data={"attack_type": "contrast", "parameter": p, "original_watermark_text": "TEST", "secret_key": "testkey"}, files={"watermarked_image": ("test.png", img_out, "image/png")})
        assert response.status_code == 200
        data = response.json()
        assert data["psnr"] is not None or p == 1.0
        assert data["extraction_status"] == "DETECTED"

