import numpy as np
from typing import Dict, Union

def calculate_ber(original_bits: np.ndarray, extracted_bits: np.ndarray) -> Dict[str, Union[float, int]]:
    """
    Calculates the Bit Error Rate (BER) between two binary sequences.
    """
    if len(original_bits) != len(extracted_bits):
        raise ValueError(f"Bit arrays must be the same length. Got {len(original_bits)} and {len(extracted_bits)}.")
        
    total_bits = len(original_bits)
    if total_bits == 0:
        raise ValueError("Bit arrays cannot be empty.")
        
    error_bits = np.sum(original_bits != extracted_bits)
    ber = float(error_bits / total_bits)
    
    return {
        "ber": ber,
        "error_bits": int(error_bits),
        "total_bits": int(total_bits)
    }
