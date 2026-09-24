from PIL import Image
import numpy as np

def apply_resize(image_array: np.ndarray, scale_percentage: float) -> np.ndarray:
    """
    Applies resizing to an image array.
    scale_percentage: 75 or 50
    """
    height, width, _ = image_array.shape
    
    scale = scale_percentage / 100.0
    new_width = int(width * scale)
    new_height = int(height * scale)
    
    img = Image.fromarray(image_array)
    # Use high-quality resampling (LANCZOS)
    resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    return np.array(resized_img)
