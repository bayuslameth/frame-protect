from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
import io
import base64
from PIL import Image
import numpy as np

from ..watermark.embed import embed_watermark
from ..watermark.extract import extract_watermark
from ..watermark.payload import text_to_bits, bits_to_text

router = APIRouter()

@router.post("/embed")
async def embed_api(
    image: UploadFile = File(...),
    watermark_type: str = Form("text"),
    watermark_text: str = Form(""),
    secret_key: str = Form(...),
    strength: float = Form(0.15),
    dct_band: str = Form("mid")
):
    if watermark_type == "text" and not watermark_text:
        raise HTTPException(status_code=400, detail="Watermark text is required for text type.")
    
    if not secret_key:
        raise HTTPException(status_code=400, detail="Secret key is required.")
        
    if strength < 0.01 or strength > 1.0:
        raise HTTPException(status_code=400, detail="Invalid embed strength.")
        
    try:
        image_bytes = await image.read()
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image_array = np.array(pil_image)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid image file.")
        
    # Generate payload
    if watermark_type == "text":
        bits = text_to_bits(watermark_text)
    else:
        # LOGO type (not fully supported yet, stub for now as requested by 'convert logo to grayscale... resize...')
        raise HTTPException(status_code=501, detail="Logo watermark type not yet implemented in backend core.")
        
    try:
        watermarked_array = embed_watermark(image_array, bits, secret_key, strength)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    # Convert back to base64
    watermarked_pil = Image.fromarray(watermarked_array)
    out_io = io.BytesIO()
    watermarked_pil.save(out_io, format="PNG")
    out_io.seek(0)
    base64_img = base64.b64encode(out_io.read()).decode('utf-8')
    data_url = f"data:image/png;base64,{base64_img}"
    
    height, width, _ = image_array.shape
    rows, cols = height // 8, width // 8
    
    return JSONResponse({
        "success": True,
        "image": data_url,
        "metadata": {
            "width": width,
            "height": height,
            "watermark_type": watermark_type,
            "payload_bits": len(bits),
            "blocks_used": len(bits),
            "strength": strength,
            "dct_band": dct_band,
            "capacity_blocks": rows * cols
        }
    })

from ..metrics.nc import calculate_nc
from ..metrics.ber import calculate_ber

@router.post("/detect")
async def detect_api(
    image: UploadFile = File(...),
    secret_key: str = Form(...),
    original_watermark_text: str = Form(None)
):
    if not secret_key:
        raise HTTPException(status_code=400, detail="Secret key is required.")
        
    try:
        image_bytes = await image.read()
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image_array = np.array(pil_image)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid image file.")
        
    try:
        extracted_bits = extract_watermark(image_array, secret_key, max_payload_bits=16384)
        recovered_text = bits_to_text(extracted_bits)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction error: {str(e)}")
        
    response_data = {
        "success": True,
        "recovered_text": recovered_text
    }
    
    if original_watermark_text:
        original_bits = text_to_bits(original_watermark_text)
        payload_length = len(original_bits)
        extracted_slice = extracted_bits[:payload_length]
        
        if len(extracted_slice) < payload_length:
            pad = np.zeros(payload_length - len(extracted_slice), dtype=np.uint8)
            extracted_slice = np.concatenate([extracted_slice, pad])
            
        try:
            nc_val = calculate_nc(original_bits, extracted_slice)
            ber_dict = calculate_ber(original_bits, extracted_slice)
            response_data["nc"] = nc_val
            response_data["ber"] = ber_dict["ber"]
        except ValueError:
            pass
            
    return JSONResponse(response_data)
