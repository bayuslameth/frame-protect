import numpy as np

# Generate the 8x8 DCT-II transformation matrix
def _get_dct_matrix():
    N = 8
    C = np.zeros((N, N))
    for i in range(N):
        for j in range(N):
            if i == 0:
                C[i, j] = 1 / np.sqrt(N)
            else:
                C[i, j] = np.sqrt(2 / N) * np.cos(np.pi * (2 * j + 1) * i / (2 * N))
    return C

DCT_MATRIX = _get_dct_matrix()
DCT_MATRIX_T = DCT_MATRIX.T

def dct_2d(block: np.ndarray) -> np.ndarray:
    """
    Computes the 2D Discrete Cosine Transform (DCT-II) of an 8x8 block
    using matrix multiplication: D = C * B * C^T
    """
    return DCT_MATRIX @ block @ DCT_MATRIX_T

def idct_2d(coefficients: np.ndarray) -> np.ndarray:
    """
    Computes the 2D Inverse Discrete Cosine Transform (IDCT-II) of an 8x8 block
    using matrix multiplication: B = C^T * D * C
    """
    return DCT_MATRIX_T @ coefficients @ DCT_MATRIX
