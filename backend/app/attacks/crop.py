import numpy as np

def apply_crop(image_array: np.ndarray, crop_percentage: float) -> np.ndarray:
    """
    Applies deterministic centered cropping to an image array.
    crop_percentage: 10 or 25 (percent to remove from edges)
    """
    height, width, channels = image_array.shape
    
    # Calculate how much to keep
    keep_ratio = 1.0 - (crop_percentage / 100.0)
    
    new_height = int(height * keep_ratio)
    new_width = int(width * keep_ratio)
    
    # Center crop
    top = (height - new_height) // 2
    left = (width - new_width) // 2
    
    return image_array[top:top+new_height, left:left+new_width, :].copy()
