from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
import io
import base64
from PIL import Image
import numpy as np
import math

from ..watermark.embed import embed_watermark
from ..watermark.extract import extract_watermark
from ..watermark.payload import text_to_bits, bits_to_text, logo_to_bits, bits_to_logo, detect_payload_type

router = APIRouter()

@router.post("/embed")
async def embed_api(
    image: UploadFile = File(...),
    watermark_type: str = Form("text"),
    watermark_text: str = Form(""),
    watermark_file: UploadFile = File(None),
    secret_key: str = Form(...),
    strength: float = Form(0.15),
    dct_band: str = Form("mid")
):
    if watermark_type == "text" and not watermark_text:
        raise HTTPException(status_code=400, detail="Watermark text is required for text type.")
    
    if watermark_type == "logo" and not watermark_file:
        raise HTTPException(status_code=400, detail="Watermark file is required for logo type.")
    
    if not secret_key:
        raise HTTPException(status_code=400, detail="Secret key is required.")
        
    if strength < 0.01 or strength > 1.0:
        raise HTTPException(status_code=400, detail="Invalid embed strength.")
        
    try:
        image_bytes = await image.read()
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image_array = np.array(pil_image)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid host image file.")
        
    height, width, _ = image_array.shape
    rows, cols = height // 8, width // 8
    capacity_blocks = rows * cols
    
    # Generate payload
    if watermark_type == "text":
        bits = text_to_bits(watermark_text)
        if len(bits) > capacity_blocks:
            raise HTTPException(status_code=400, detail=f"Text too long. Capacity is {capacity_blocks} bits.")
    elif watermark_type == "logo":
        try:
            wm_bytes = await watermark_file.read()
            wm_img = Image.open(io.BytesIO(wm_bytes))
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid watermark image file.")
            
        max_pixels = capacity_blocks - 56
        if max_pixels <= 0:
            raise HTTPException(status_code=400, detail="Host image too small to hold any logo.")
            
        wm_w, wm_h = wm_img.size
        if wm_w * wm_h > max_pixels:
            # Resize
            scale = math.sqrt(max_pixels / (wm_w * wm_h))
            new_w = max(1, int(wm_w * scale))
            new_h = max(1, int(wm_h * scale))
            wm_img = wm_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            
        bits = logo_to_bits(wm_img)
    else:
        raise HTTPException(status_code=400, detail="Invalid watermark type.")
        
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
            "capacity_blocks": capacity_blocks
        }
    })

from ..metrics.nc import calculate_nc
from ..metrics.ber import calculate_ber

@router.post("/detect")
async def detect_api(
    image: UploadFile = File(...),
    secret_key: str = Form(...),
    original_watermark_text: str = Form(None),
    original_watermark_file: UploadFile = File(None)
):
    if not secret_key:
        raise HTTPException(status_code=400, detail="Secret key is required.")
        
    try:
        image_bytes = await image.read()
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image_array = np.array(pil_image)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file.")
        
    try:
        height, width, _ = image_array.shape
        max_capacity = (height // 8) * (width // 8)
        # Extract maximum possible bits first, then parse
        extracted_bits = extract_watermark(image_array, secret_key, max_payload_bits=max_capacity)
        ptype = detect_payload_type(extracted_bits)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction error: {str(e)}")
        
    response_data = {
        "success": True,
        "watermark_type": ptype,
    }
    
    if ptype == "text":
        recovered_text = bits_to_text(extracted_bits)
        response_data["recovered_text"] = recovered_text
    elif ptype == "image":
        recovered_logo = bits_to_logo(extracted_bits)
        if recovered_logo:
            out_io = io.BytesIO()
            recovered_logo.save(out_io, format="PNG")
            out_io.seek(0)
            base64_img = base64.b64encode(out_io.read()).decode('utf-8')
            response_data["recovered_logo"] = f"data:image/png;base64,{base64_img}"
        else:
            response_data["success"] = False
            response_data["error"] = "Failed to parse logo payload."
    else:
        response_data["success"] = False
        response_data["error"] = "Invalid or corrupted watermark payload."
        # Keep backwards compat if it fails
        response_data["recovered_text"] = ""
    
    # Metrics
    original_bits = None
    if ptype == "text" and original_watermark_text:
        original_bits = text_to_bits(original_watermark_text)
    elif ptype == "image" and original_watermark_file:
        try:
            wm_bytes = await original_watermark_file.read()
            wm_img = Image.open(io.BytesIO(wm_bytes))
            
            max_pixels = max_capacity - 56
            wm_w, wm_h = wm_img.size
            if wm_w * wm_h > max_pixels:
                scale = math.sqrt(max_pixels / (wm_w * wm_h))
                new_w = max(1, int(wm_w * scale))
                new_h = max(1, int(wm_h * scale))
                wm_img = wm_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
                
            original_bits = logo_to_bits(wm_img)
        except Exception:
            pass
            
    if original_bits is not None:
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
