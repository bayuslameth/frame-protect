from PIL import Image, ImageEnhance
import numpy as np

def apply_brightness(image_array: np.ndarray, delta: float) -> np.ndarray:
    """
    Applies brightness transformation.
    delta: -30 or +30. 
    We treat delta as a percentage offset: 1.0 + (delta / 100.0)
    So -30 means 0.7 factor (darker), +30 means 1.3 factor (brighter).
    """
    factor = 1.0 + (delta / 100.0)
    factor = max(0.0, factor)
    
    img = Image.fromarray(image_array)
    enhancer = ImageEnhance.Brightness(img)
    brightened_img = enhancer.enhance(factor)
    
    return np.array(brightened_img)
