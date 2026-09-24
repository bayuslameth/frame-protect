from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
import io
import base64
from PIL import Image
import numpy as np

from ..attacks.types import AttackType, AttackParameters
from ..attacks.service import apply_attack
from ..watermark.extract import extract_watermark
from ..watermark.payload import text_to_bits, bits_to_text
from ..metrics.psnr import calculate_psnr
from ..metrics.nc import calculate_nc
from ..metrics.ber import calculate_ber

router = APIRouter()

@router.post("/apply")
async def apply_attack_api(
    image: UploadFile = File(...),
    attack_type: str = Form(...),
    parameter: float = Form(...)
):
    try:
        attack_params = AttackParameters(attack_type=attack_type, parameter=parameter)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    try:
        image_bytes = await image.read()
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image_array = np.array(pil_image)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid image file.")
        
    try:
        attacked_img_array, metadata = apply_attack(image_array, attack_params.attack_type, attack_params.parameter)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Attack failed: {str(e)}")
        
    # Convert attacked array back to base64
    attacked_pil = Image.fromarray(attacked_img_array)
    out_io = io.BytesIO()
    # Save as PNG to avoid unintended double compression
    attacked_pil.save(out_io, format="PNG")
    out_io.seek(0)
    base64_img = base64.b64encode(out_io.read()).decode('utf-8')
    data_url = f"data:image/png;base64,{base64_img}"
    
    return JSONResponse({
        "success": True,
        "attacked_image": data_url,
        **metadata
    })

@router.post("/test")
async def test_attack_api(
    watermarked_image: UploadFile = File(...),
    original_watermark_text: str = Form(...),
    secret_key: str = Form(...),
    attack_type: str = Form(...),
    parameter: float = Form(...)
):
    try:
        attack_params = AttackParameters(attack_type=attack_type, parameter=parameter)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    try:
        image_bytes = await watermarked_image.read()
        wm_pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        wm_image_array = np.array(wm_pil_image)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid watermarked image file.")
        
    # 1. Apply attack
    try:
        attacked_img_array, metadata = apply_attack(wm_image_array, attack_params.attack_type, attack_params.parameter)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Attack failed: {str(e)}")
        
    # 2. Extract Watermark
    extraction_status = "DETECTED"
    extracted_text = ""
    nc_val = None
    ber_val = None
    
    try:
        orig_bits = text_to_bits(original_watermark_text)
        
        # We need to make sure the dimensions are compatible for extraction
        # If crop or resize changed dims, we extract from the new dimensions. 
        # But if the capacity is too small, extraction might fail.
        # DCT extraction usually needs 8x8 blocks. If attacked image is < 8x8, it fails.
        height, width = attacked_img_array.shape[:2]
        if height < 8 or width < 8:
            extraction_status = "FAILED"
            extracted_text = ""
        else:
            extracted_bits = extract_watermark(attacked_img_array, secret_key, max_payload_bits=len(orig_bits))
            
            # Reconstruct text
            extracted_text = bits_to_text(extracted_bits)
            
            # We may have fewer bits if the image was cropped/resized too small
            # Pad or truncate extracted_bits to match orig_bits length for fair BER/NC calculation
            if len(extracted_bits) < len(orig_bits):
                padded = np.zeros(len(orig_bits), dtype=np.uint8)
                padded[:len(extracted_bits)] = extracted_bits
                eval_bits = padded
            else:
                eval_bits = extracted_bits[:len(orig_bits)]
                
            nc_val = calculate_nc(orig_bits, eval_bits)
            ber_val = calculate_ber(orig_bits, eval_bits)
            
    except Exception as e:
        extraction_status = "FAILED"
        extracted_text = ""
        
    # 3. Calculate PSNR
    # PSNR convention: Watermarked Image vs Attacked Image
    import math
    try:
        # PSNR requires same dimensions. If dimensions changed (Crop/Resize), PSNR is not easily calculated
        # without padding/cropping. We will only calculate PSNR if dimensions match.
        if wm_image_array.shape == attacked_img_array.shape:
            psnr_val = calculate_psnr(wm_image_array, attacked_img_array)
            if math.isinf(psnr_val):
                psnr_val = -1.0
        else:
            psnr_val = None # Not valid for dimension-changing attacks
    except Exception as e:
        psnr_val = None
        
    # Convert attacked image to base64
    attacked_pil = Image.fromarray(attacked_img_array)
    out_io = io.BytesIO()
    attacked_pil.save(out_io, format="PNG")
    out_io.seek(0)
    base64_img = base64.b64encode(out_io.read()).decode('utf-8')
    data_url = f"data:image/png;base64,{base64_img}"
    
    return JSONResponse({
        "success": True,
        "attacked_image": data_url,
        "attack_type": attack_params.attack_type.value,
        "parameter": attack_params.parameter,
        "original_dimensions": metadata["original_dimensions"],
        "attacked_dimensions": metadata["attacked_dimensions"],
        "extraction_status": extraction_status,
        "extracted_watermark": extracted_text,
        "psnr": psnr_val,
        "nc": nc_val,
        "ber": ber_val
    })
