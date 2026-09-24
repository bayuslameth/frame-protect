import numpy as np
from typing import Tuple, Dict, Any

from .types import AttackType, AttackParameters
from .jpeg import apply_jpeg_compression
from .crop import apply_crop
from .resize import apply_resize
from .noise import apply_gaussian_noise
from .brightness import apply_brightness
from .contrast import apply_contrast

def apply_attack(image_array: np.ndarray, attack_type: AttackType, parameter: float) -> Tuple[np.ndarray, Dict[str, Any]]:
    """
    Unified attack interface.
    Returns:
        attacked_image: np.ndarray
        metadata: dict containing original/attacked dimensions, type, param
    """
    orig_height, orig_width = image_array.shape[:2]
    
    if attack_type == AttackType.JPEG:
        attacked_img = apply_jpeg_compression(image_array, int(parameter))
    elif attack_type == AttackType.CROP:
        attacked_img = apply_crop(image_array, parameter)
    elif attack_type == AttackType.RESIZE:
        attacked_img = apply_resize(image_array, parameter)
    elif attack_type == AttackType.GAUSSIAN_NOISE:
        attacked_img = apply_gaussian_noise(image_array, parameter)
    elif attack_type == AttackType.BRIGHTNESS:
        attacked_img = apply_brightness(image_array, parameter)
    elif attack_type == AttackType.CONTRAST:
        attacked_img = apply_contrast(image_array, parameter)
    else:
        raise ValueError(f"Unknown attack type: {attack_type}")
        
    attacked_height, attacked_width = attacked_img.shape[:2]
    
    metadata = {
        "attack_type": attack_type.value,
        "parameter": parameter,
        "original_dimensions": {"width": orig_width, "height": orig_height},
        "attacked_dimensions": {"width": attacked_width, "height": attacked_height}
    }
    
    return attacked_img, metadata
