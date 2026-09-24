import hashlib
import numpy as np
from typing import List, Tuple

def derive_seed(secret_key: str) -> int:
    """
    Derives a deterministic integer seed from the secret key using SHA-256.
    """
    h = hashlib.sha256(secret_key.encode('utf-8')).digest()
    # Use first 4 bytes for a 32-bit seed
    return int.from_bytes(h[:4], byteorder='big')

def get_block_sequence(secret_key: str, total_blocks: int, payload_bits: int) -> List[int]:
    """
    Generates a deterministic sequence of block indices to embed/extract the watermark.
    """
    if payload_bits > total_blocks:
        raise ValueError(f"Payload ({payload_bits} bits) is too large for image capacity ({total_blocks} blocks).")
    
    seed = derive_seed(secret_key)
    rng = np.random.default_rng(seed)
    
    # Generate permutation of all possible block indices
    indices = np.arange(total_blocks)
    rng.shuffle(indices)
    
    # Take the first `payload_bits` blocks
    return indices[:payload_bits].tolist()
