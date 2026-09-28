import pytest
import numpy as np
from PIL import Image
import io
from fastapi.testclient import TestClient

from app.main import app
from app.watermark.payload import logo_to_bits, bits_to_logo, detect_payload_type

client = TestClient(app)

def create_test_image(width=64, height=64, color=(128, 128, 128)):
    img = Image.new("RGB", (width, height), color)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf.read()

def create_test_logo(width=8, height=8):
    img = Image.new("L", (width, height), color=0)
    # Put a white dot in the middle
    img.putpixel((width//2, height//2), 255)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf.read()

def test_logo_payload_encoding_decoding():
    logo_bytes = create_test_logo(8, 8)
    logo_img = Image.open(io.BytesIO(logo_bytes))
    
    bits = logo_to_bits(logo_img)
    
    assert len(bits) == 56 + (8 * 8)
    assert detect_payload_type(bits) == "image"
    
    recovered_logo = bits_to_logo(bits)
    assert recovered_logo is not None
    assert recovered_logo.size == (8, 8)
    
    # Check if center is white (255)
    pixel = recovered_logo.getpixel((4, 4))
    assert pixel == 255

def test_embed_and_detect_logo_api():
    img_bytes = create_test_image(128, 128)
    logo_bytes = create_test_logo(8, 8)
    
    # Embed
    response = client.post(
        "/api/watermark/embed",
        data={
            "watermark_type": "logo",
            "secret_key": "test_logo_key",
            "strength": "0.15"
        },
        files={
            "image": ("test.png", img_bytes, "image/png"),
            "watermark_file": ("logo.png", logo_bytes, "image/png")
        }
    )
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["success"] is True
    
    watermarked_data_url = res_data["image"]
    header, b64 = watermarked_data_url.split(",", 1)
    import base64
    watermarked_bytes = base64.b64decode(b64)
    
    # Detect
    detect_response = client.post(
        "/api/watermark/detect",
        data={
            "secret_key": "test_logo_key"
        },
        files={
            "image": ("wm.png", watermarked_bytes, "image/png"),
            "original_watermark_file": ("logo.png", logo_bytes, "image/png")
        }
    )
    assert detect_response.status_code == 200
    detect_data = detect_response.json()
    assert detect_data["success"] is True
    assert detect_data["watermark_type"] == "image"
    assert "recovered_logo" in detect_data
    
    assert detect_data["nc"] > 0.8
    assert detect_data["ber"] < 0.2

def test_detect_wrong_key_api():
    img_bytes = create_test_image(128, 128)
    logo_bytes = create_test_logo(8, 8)
    
    response = client.post(
        "/api/watermark/embed",
        data={
            "watermark_type": "logo",
            "secret_key": "test_logo_key",
            "strength": "0.15"
        },
        files={
            "image": ("test.png", img_bytes, "image/png"),
            "watermark_file": ("logo.png", logo_bytes, "image/png")
        }
    )
    res_data = response.json()
    watermarked_data_url = res_data["image"]
    import base64
    watermarked_bytes = base64.b64decode(watermarked_data_url.split(",", 1)[1])
    
    detect_response = client.post(
        "/api/watermark/detect",
        data={
            "secret_key": "WRONG_KEY"
        },
        files={
            "image": ("wm.png", watermarked_bytes, "image/png"),
            "original_watermark_file": ("logo.png", logo_bytes, "image/png")
        }
    )
    assert detect_response.status_code == 200
    detect_data = detect_response.json()
    # It might fail to parse as image or recover garbage
    # If it recovers garbage, success could be True but NC should be low
    if detect_data["success"]:
        if "nc" in detect_data:
            assert detect_data["nc"] < 0.8

def test_capacity_check():
    img_bytes = create_test_image(64, 64) # 8x8 blocks = 64 blocks
    # Max pixels = 64 - 56 = 8 pixels.
    logo_bytes = create_test_logo(16, 16) # 256 pixels
    
    # It should resize!
    response = client.post(
        "/api/watermark/embed",
        data={
            "watermark_type": "logo",
            "secret_key": "key",
            "strength": "0.15"
        },
        files={
            "image": ("test.png", img_bytes, "image/png"),
            "watermark_file": ("logo.png", logo_bytes, "image/png")
        }
    )
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["metadata"]["capacity_blocks"] == 64
    assert res_data["metadata"]["blocks_used"] <= 64

