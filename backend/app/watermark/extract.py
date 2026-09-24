import numpy as np
from PIL import Image
from .dct import dct_2d
from .key import derive_seed

U1, V1 = 4, 5
U2, V2 = 5, 4

def _extract_bit(block: np.ndarray) -> int:
    """
    Extracts a single bit from an 8x8 spatial block.
    """
    shifted = block.astype(float) - 128.0
    D = dct_2d(shifted)
    
    mag1 = abs(D[U1, V1])
    mag2 = abs(D[U2, V2])
    
    return 1 if mag1 > mag2 else 0

def extract_watermark(image_array: np.ndarray, secret_key: str, max_payload_bits: int = 16384) -> np.ndarray:
    """
    Extracts a bit sequence from the Y channel of an RGB image.
    We don't know the exact payload length until we parse the header,
    but we can extract a fixed maximum amount first, or parse the header dynamically.
    For simplicity, let's extract `max_payload_bits` or total blocks, whichever is smaller,
    and let the payload parser handle the rest.
    """
    img = Image.fromarray(image_array).convert('YCbCr')
    y_channel, _, _ = img.split()
    y_array = np.array(y_channel, dtype=float)
    
    height, width = y_array.shape
    rows = height // 8
    cols = width // 8
    total_blocks = rows * cols
    
    bits_to_extract = min(max_payload_bits, total_blocks)
    
    # Generate the full sequence of indices up to bits_to_extract
    seed = derive_seed(secret_key)
    rng = np.random.default_rng(seed)
    indices = np.arange(total_blocks)
    rng.shuffle(indices)
    block_indices = indices[:bits_to_extract].tolist()
    
    bits = np.zeros(bits_to_extract, dtype=np.uint8)
    
    for i, block_idx in enumerate(block_indices):
        r = (block_idx // cols) * 8
        c = (block_idx % cols) * 8
        block = y_array[r:r+8, c:c+8]
        bits[i] = _extract_bit(block)
        
    return bits
