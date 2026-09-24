import numpy as np

def calculate_psnr(original: np.ndarray, processed: np.ndarray) -> float:
    """
    Calculates Peak Signal-to-Noise Ratio (PSNR) between two images.
    Returns float('inf') if images are identical.
    """
    if original.shape != processed.shape:
        raise ValueError("Images must have the same dimensions to calculate PSNR.")
        
    mse = np.mean((original.astype(float) - processed.astype(float)) ** 2)
    if mse == 0:
        return float('inf')
        
    max_pixel = 255.0
    psnr = 10 * np.log10((max_pixel ** 2) / mse)
    return float(psnr)
