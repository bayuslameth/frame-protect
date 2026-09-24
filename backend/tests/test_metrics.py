import numpy as np
import pytest
from app.metrics.psnr import calculate_psnr
from app.metrics.nc import calculate_nc
from app.metrics.ber import calculate_ber

def test_psnr_identical():
    img1 = np.ones((10, 10, 3), dtype=np.uint8) * 128
    psnr = calculate_psnr(img1, img1)
    assert psnr == float('inf')

def test_psnr_difference():
    img1 = np.zeros((10, 10, 3), dtype=np.uint8)
    img2 = np.ones((10, 10, 3), dtype=np.uint8) # MSE = 1
    psnr = calculate_psnr(img1, img2)
    # PSNR = 10 * log10(255^2 / 1) = 10 * log10(65025) ≈ 48.1308
    assert np.isclose(psnr, 48.1308, atol=0.001)

def test_nc_identical():
    bits1 = np.array([1, 0, 1, 0, 1, 1, 0, 0], dtype=np.uint8)
    nc = calculate_nc(bits1, bits1)
    assert np.isclose(nc, 1.0)

def test_nc_inverted():
    bits1 = np.array([1, 0, 1, 0], dtype=np.uint8)
    bits2 = np.array([0, 1, 0, 1], dtype=np.uint8)
    nc = calculate_nc(bits1, bits2)
    assert np.isclose(nc, -1.0)

def test_nc_orthogonal():
    # b1 = [1, 1, -1, -1], b2 = [1, -1, 1, -1] -> dot product = 0
    bits1 = np.array([1, 1, 0, 0], dtype=np.uint8)
    bits2 = np.array([1, 0, 1, 0], dtype=np.uint8)
    nc = calculate_nc(bits1, bits2)
    assert np.isclose(nc, 0.0)

def test_ber_identical():
    bits1 = np.array([1, 0, 1, 0], dtype=np.uint8)
    res = calculate_ber(bits1, bits1)
    assert res['ber'] == 0.0
    assert res['error_bits'] == 0
    assert res['total_bits'] == 4

def test_ber_difference():
    bits1 = np.array([1, 0, 1, 0], dtype=np.uint8)
    bits2 = np.array([1, 1, 1, 0], dtype=np.uint8)
    res = calculate_ber(bits1, bits2)
    assert res['ber'] == 0.25
    assert res['error_bits'] == 1
    assert res['total_bits'] == 4
