from PIL import Image, ImageEnhance
import numpy as np

def apply_contrast(image_array: np.ndarray, factor: float) -> np.ndarray:
    """
    Applies contrast transformation.
    factor: 0.7, 1.0, 1.3
    """
    img = Image.fromarray(image_array)
    enhancer = ImageEnhance.Contrast(img)
    contrasted_img = enhancer.enhance(factor)
    
    return np.array(contrasted_img)
