import numpy as np
from PIL import Image
from .dct import dct_2d, idct_2d
from .key import get_block_sequence

# Coefficient indices
U1, V1 = 4, 5
U2, V2 = 5, 4
SCALE_FACTOR = 100.0

def _embed_bit(block: np.ndarray, bit: int, margin: float) -> np.ndarray:
    """
    Embeds a single bit into an 8x8 spatial block.
    """
    # 1. Level shift
    shifted = block.astype(float) - 128.0
    
    # 2. Compute DCT
    D = dct_2d(shifted)
    
    # 3. Modify mid-frequency coefficients
    c1 = D[U1, V1]
    c2 = D[U2, V2]
    
    mag1 = abs(c1)
    mag2 = abs(c2)
    
    if bit == 1:
        # We want mag1 > mag2 + margin
        if mag1 - mag2 < margin:
            diff = margin - (mag1 - mag2)
            mag1 += diff / 2
            mag2 -= diff / 2
            if mag2 < 0:
                mag1 += abs(mag2)
                mag2 = 0
    else:
        # We want mag2 > mag1 + margin
        if mag2 - mag1 < margin:
            diff = margin - (mag2 - mag1)
            mag2 += diff / 2
            mag1 -= diff / 2
            if mag1 < 0:
                mag2 += abs(mag1)
                mag1 = 0
                
    # Restore signs
    D[U1, V1] = mag1 if c1 >= 0 else -mag1
    D[U2, V2] = mag2 if c2 >= 0 else -mag2
    
    # 4. Compute IDCT
    B_mod = idct_2d(D)
    
    # 5. Reverse level shift and clip
    final_block = np.clip(np.round(B_mod + 128.0), 0, 255)
    return final_block

def embed_watermark(image_array: np.ndarray, bits: np.ndarray, secret_key: str, strength: float) -> np.ndarray:
    """
    Embeds a bit sequence into a YCbCr image's Y channel using DCT.
    Expects RGB uint8 image array.
    """
    margin = strength * SCALE_FACTOR
    
    # Convert to YCbCr using standard BT.601
    img = Image.fromarray(image_array).convert('YCbCr')
    y_channel, cb_channel, cr_channel = img.split()
    y_array = np.array(y_channel, dtype=float)
    
    height, width = y_array.shape
    
    # Calculate capacity
    rows = height // 8
    cols = width // 8
    total_blocks = rows * cols
    
    if len(bits) > total_blocks:
        raise ValueError(f"Payload ({len(bits)} bits) exceeds image capacity ({total_blocks} blocks).")
        
    block_indices = get_block_sequence(secret_key, total_blocks, len(bits))
    
    watermarked_y = y_array.copy()
    
    for i, block_idx in enumerate(block_indices):
        r = (block_idx // cols) * 8
        c = (block_idx % cols) * 8
        
        block = watermarked_y[r:r+8, c:c+8]
        watermarked_block = _embed_bit(block, bits[i], margin)
        watermarked_y[r:r+8, c:c+8] = watermarked_block
        
    # Reconstruct Image
    watermarked_y_img = Image.fromarray(np.uint8(watermarked_y))
    final_img = Image.merge('YCbCr', (watermarked_y_img, cb_channel, cr_channel)).convert('RGB')
    
    return np.array(final_img)
