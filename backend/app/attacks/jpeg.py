import io
from PIL import Image
import numpy as np

def apply_jpeg_compression(image_array: np.ndarray, quality: int) -> np.ndarray:
    """
    Applies JPEG compression to an image array.
    """
    img = Image.fromarray(image_array)
    out_io = io.BytesIO()
    img.save(out_io, format="JPEG", quality=quality)
    out_io.seek(0)
    attacked_img = Image.open(out_io).convert("RGB")
    return np.array(attacked_img)
