from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
import io
from PIL import Image
import numpy as np
import json

from ..metrics import calculate_psnr, calculate_nc, calculate_ber
from ..watermark.payload import text_to_bits
from ..watermark.extract import extract_watermark

router = APIRouter()

def _load_image(file_bytes: bytes) -> np.ndarray:
    try:
        pil_image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        return np.array(pil_image)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file.")

@router.post("/verify")
async def verify_api(
    original_image: UploadFile = File(...),
    watermarked_image: UploadFile = File(...),
    watermark_type: str = Form("text"),
    watermark_text: str = Form(""),
    secret_key: str = Form(...)
):
    if not secret_key:
        raise HTTPException(status_code=400, detail="Secret key is required.")
        
    orig_bytes = await original_image.read()
    wm_bytes = await watermarked_image.read()
    
    orig_array = _load_image(orig_bytes)
    wm_array = _load_image(wm_bytes)
    
    # 1. PSNR
    try:
        psnr_val = calculate_psnr(orig_array, wm_array)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    # 2. Re-extract to verify NC and BER
    if watermark_type != "text":
        raise HTTPException(status_code=501, detail="Only text payload currently supported.")
        
    if not watermark_text:
        raise HTTPException(status_code=400, detail="Watermark text is required for verification.")
        
    original_bits = text_to_bits(watermark_text)
    payload_length = len(original_bits)
    
    try:
        extracted_bits = extract_watermark(wm_array, secret_key, max_payload_bits=payload_length)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")
        
    # Slice to compare exact payload length
    extracted_slice = extracted_bits[:payload_length]
    
    if len(extracted_slice) < payload_length:
        # Pad with zeros if extraction returned too few bits (shouldn't happen on valid capacity)
        pad = np.zeros(payload_length - len(extracted_slice), dtype=np.uint8)
        extracted_slice = np.concatenate([extracted_slice, pad])
        
    try:
        nc_val = calculate_nc(original_bits, extracted_slice)
        ber_dict = calculate_ber(original_bits, extracted_slice)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    return JSONResponse({
        "success": True,
        "metrics": {
            "psnr": {
                "value": psnr_val,
                "unit": "dB"
            },
            "nc": {
                "value": nc_val
            },
            "ber": {
                "value": ber_dict["ber"],
                "total_bits": ber_dict["total_bits"],
                "error_bits": ber_dict["error_bits"]
            }
        }
    })
