import numpy as np

def apply_gaussian_noise(image_array: np.ndarray, sigma: float, seed: int = 42) -> np.ndarray:
    """
    Applies Gaussian noise to an image array.
    """
    rng = np.random.default_rng(seed)
    noise = rng.normal(loc=0.0, scale=sigma, size=image_array.shape)
    
    noisy_array = image_array.astype(float) + noise
    noisy_array = np.clip(noisy_array, 0, 255).astype(np.uint8)
    
    return noisy_array
