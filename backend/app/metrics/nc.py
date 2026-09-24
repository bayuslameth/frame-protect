import numpy as np

def calculate_nc(original_bits: np.ndarray, extracted_bits: np.ndarray) -> float:
    """
    Calculates Normalized Correlation (NC) between two binary watermark sequences.
    Maps bits (0,1) to bipolar (-1,1) for meaningful mathematical correlation.
    """
    if len(original_bits) != len(extracted_bits):
        raise ValueError(f"Bit arrays must be the same length. Got {len(original_bits)} and {len(extracted_bits)}.")
        
    if len(original_bits) == 0:
        raise ValueError("Bit arrays cannot be empty.")
        
    b1 = np.where(original_bits == 0, -1.0, 1.0)
    b2 = np.where(extracted_bits == 0, -1.0, 1.0)
    
    num = np.sum(b1 * b2)
    den = np.sqrt(np.sum(b1**2) * np.sum(b2**2))
    
    if den == 0:
        return 0.0
        
    return float(num / den)
