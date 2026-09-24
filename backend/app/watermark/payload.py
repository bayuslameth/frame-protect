import numpy as np

MAGIC = b'FP'
VERSION = 1

def text_to_bits(text: str) -> np.ndarray:
    """
    Converts a text string to a binary array including header.
    Format: MAGIC (16 bits) + VERSION (8 bits) + PAYLOAD LENGTH in bits (32 bits) + PAYLOAD
    """
    payload_bytes = text.encode('utf-8')
    payload_len_bits = len(payload_bytes) * 8
    
    header = MAGIC + VERSION.to_bytes(1, 'big') + payload_len_bits.to_bytes(4, 'big')
    full_bytes = header + payload_bytes
    
    # Convert bytes to bits
    bits = np.unpackbits(np.frombuffer(full_bytes, dtype=np.uint8))
    return bits

def bits_to_text(bits: np.ndarray) -> str:
    """
    Recovers text from a bit array parsing the header.
    Returns empty string if magic doesn't match.
    """
    if len(bits) < 56: # 16 + 8 + 32
        return ""
        
    bytes_data = np.packbits(bits).tobytes()
    magic = bytes_data[0:2]
    if magic != MAGIC:
        return ""
        
    version = bytes_data[2]
    if version != VERSION:
        return ""
        
    payload_len_bits = int.from_bytes(bytes_data[3:7], 'big')
    payload_len_bytes = payload_len_bits // 8
    
    if 7 + payload_len_bytes > len(bytes_data):
        return ""
        
    payload = bytes_data[7:7+payload_len_bytes]
    try:
        return payload.decode('utf-8')
    except UnicodeDecodeError:
        return ""

def logo_to_bits(logo_bytes: bytes, threshold: int = 128) -> np.ndarray:
    """
    Convert a small logo image into a binary payload.
    (This is basic mapping, but the prompt says 'Convert logo to grayscale... resize...').
    Since we only need bits, we will do the resize in the endpoint/service,
    and here just take the grayscale pixel array and binarize it.
    """
    pass # We will implement logo encoding properly if needed, but text is priority for testing structure first.

