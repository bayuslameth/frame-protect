import numpy as np
from app.watermark.dct import dct_2d, idct_2d
from app.watermark.payload import text_to_bits, bits_to_text
from app.watermark.embed import embed_watermark
from app.watermark.extract import extract_watermark

def test_dct_idct():
    block = np.random.rand(8, 8) * 255.0
    D = dct_2d(block)
    B = idct_2d(D)
    assert np.allclose(block, B, atol=1e-5)

def test_payload():
    text = "FRAME PROTECT © 2026"
    bits = text_to_bits(text)
    recovered = bits_to_text(bits)
    assert recovered == text

def test_embed_extract():
    # 64x64 image = 8x8 blocks = 64 blocks
    image = np.random.randint(0, 256, (128, 128, 3), dtype=np.uint8)
    text = "TEST"
    bits = text_to_bits(text)
    
    # 64 blocks needed for magic(16)+ver(8)+len(32)+payload(32) = 88 bits
    # Wait! 128x128 = 16x16 blocks = 256 blocks, so it fits.
    
    key = "super_secret"
    watermarked = embed_watermark(image, bits, key, 0.15)
    
    assert watermarked.shape == image.shape
    assert watermarked.dtype == np.uint8
    
    extracted_bits = extract_watermark(watermarked, key, max_payload_bits=256)
    recovered = bits_to_text(extracted_bits)
    assert recovered == text
