import numpy as np
from PIL import Image

MAGIC = b'FP'
MAGIC_IMG = b'FI'
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

def logo_to_bits(logo_img: Image.Image) -> np.ndarray:
    """
    Converts a logo image to a binary payload.
    Format: MAGIC_IMG (2 bytes) + VERSION (1 byte) + WIDTH (2 bytes) + HEIGHT (2 bytes) + PIXELS (1 bit per pixel)
    """
    gray = logo_img.convert('L')
    # Binarize with threshold 128
    binary = (np.array(gray) > 127).astype(np.uint8)
    
    width, height = logo_img.size
    
    header = MAGIC_IMG + VERSION.to_bytes(1, 'big') + width.to_bytes(2, 'big') + height.to_bytes(2, 'big')
    header_bits = np.unpackbits(np.frombuffer(header, dtype=np.uint8))
    
    pixel_bits = binary.flatten()
    
    return np.concatenate((header_bits, pixel_bits))

def bits_to_logo(bits: np.ndarray) -> Image.Image:
    """
    Recovers a logo image from a bit array.
    Returns None if magic doesn't match or corrupted.
    """
    if len(bits) < 56: # 2 + 1 + 2 + 2 = 7 bytes = 56 bits
        return None
        
    # Only need to pack first 7 bytes to read header
    header_bytes = np.packbits(bits[:56]).tobytes()
    magic = header_bytes[0:2]
    if magic != MAGIC_IMG:
        return None
        
    version = header_bytes[2]
    if version != VERSION:
        return None
        
    width = int.from_bytes(header_bytes[3:5], 'big')
    height = int.from_bytes(header_bytes[5:7], 'big')
    
    total_pixels = width * height
    if total_pixels == 0 or len(bits) < 56 + total_pixels:
        return None
        
    pixel_bits = bits[56:56+total_pixels]
    # Multiply by 255 so 1 becomes white, 0 becomes black
    pixels_255 = pixel_bits * 255
    pixel_array = pixels_255.reshape((height, width)).astype(np.uint8)
    
    return Image.fromarray(pixel_array, mode='L')

def detect_payload_type(bits: np.ndarray) -> str:
    """
    Detects if the payload is text or image based on magic bytes.
    Returns 'text', 'image', or 'unknown'
    """
    if len(bits) < 16:
        return "unknown"
    header_bytes = np.packbits(bits[:16]).tobytes()
    magic = header_bytes[0:2]
    if magic == MAGIC:
        return "text"
    elif magic == MAGIC_IMG:
        return "image"
    return "unknown"
