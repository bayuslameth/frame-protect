from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
import io
import math
import base64
from PIL import Image
import numpy as np

from ..metrics import calculate_psnr, calculate_nc, calculate_ber
from ..watermark.payload import text_to_bits, bits_to_text, logo_to_bits, bits_to_logo, detect_payload_type
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
    watermark_file: UploadFile = File(None),
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
        
    # Capacity logic
    height, width, _ = orig_array.shape
    capacity_blocks = (height // 8) * (width // 8)
        
    if watermark_type == "text":
        if not watermark_text:
            raise HTTPException(status_code=400, detail="Watermark text is required for text verification.")
        original_bits = text_to_bits(watermark_text)
    elif watermark_type == "logo":
        if not watermark_file:
            raise HTTPException(status_code=400, detail="Watermark file is required for logo verification.")
        wm_file_bytes = await watermark_file.read()
        try:
            wm_img = Image.open(io.BytesIO(wm_file_bytes))
            max_pixels = capacity_blocks - 56
            wm_w, wm_h = wm_img.size
            if wm_w * wm_h > max_pixels:
                scale = math.sqrt(max_pixels / (wm_w * wm_h))
                new_w = max(1, int(wm_w * scale))
                new_h = max(1, int(wm_h * scale))
                wm_img = wm_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            original_bits = logo_to_bits(wm_img)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid watermark file.")
    else:
        raise HTTPException(status_code=400, detail="Invalid watermark type.")
        
    payload_length = len(original_bits)
    
    try:
        extracted_bits = extract_watermark(wm_array, secret_key, max_payload_bits=payload_length)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")
        
    # Slice to compare exact payload length
    extracted_slice = extracted_bits[:payload_length]
    if len(extracted_slice) < payload_length:
        pad = np.zeros(payload_length - len(extracted_slice), dtype=np.uint8)
        extracted_slice = np.concatenate([extracted_slice, pad])
        
    try:
        nc_val = calculate_nc(original_bits, extracted_slice)
        ber_dict = calculate_ber(original_bits, extracted_slice)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    ptype = detect_payload_type(extracted_slice)
    
    response_data = {
        "success": True,
        "watermark_type": ptype,
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
    }
    
    if ptype == "text":
        response_data["recovered_text"] = bits_to_text(extracted_slice)
    elif ptype == "image":
        recovered_logo = bits_to_logo(extracted_slice)
        if recovered_logo:
            out_io = io.BytesIO()
            recovered_logo.save(out_io, format="PNG")
            out_io.seek(0)
            base64_img = base64.b64encode(out_io.read()).decode('utf-8')
            response_data["recovered_logo"] = f"data:image/png;base64,{base64_img}"
            
    return JSONResponse(response_data)
