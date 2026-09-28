const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface EmbedRequest {
  image: File;
  watermark_type: "text" | "logo";
  watermark_text?: string;
  watermark_file?: File;
  secret_key: string;
  strength: number;
  dct_band: string;
}

export interface EmbedResponse {
  success: boolean;
  image: string; // base64 URL
  metadata: {
    width: number;
    height: number;
    watermark_type: string;
    payload_bits: number;
    blocks_used: number;
    strength: number;
    dct_band: string;
    capacity_blocks: number;
  };
}

export async function embedWatermark(req: EmbedRequest): Promise<EmbedResponse> {
  const formData = new FormData();
  formData.append("image", req.image);
  formData.append("watermark_type", req.watermark_type);
  if (req.watermark_text) formData.append("watermark_text", req.watermark_text);
  if (req.watermark_file) formData.append("watermark_file", req.watermark_file);
  formData.append("secret_key", req.secret_key);
  formData.append("strength", req.strength.toString());
  formData.append("dct_band", req.dct_band);

  const response = await fetch(`${API_URL}/api/watermark/embed`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server error: ${response.status}`);
  }

  return response.json();
}

export interface DetectRequest {
  image: File;
  secret_key: string;
  original_watermark_text?: string;
  original_watermark_file?: File;
}

export interface DetectResponse {
  success: boolean;
  recovered_text: string;
  nc?: number;
  ber?: number;
}

export async function detectWatermark(req: DetectRequest): Promise<DetectResponse> {
  const formData = new FormData();
  formData.append("image", req.image);
  formData.append("secret_key", req.secret_key);
  if (req.original_watermark_text) {
    formData.append("original_watermark_text", req.original_watermark_text);
  }
  if (req.original_watermark_file) {
    formData.append("original_watermark_file", req.original_watermark_file);
  }

  const response = await fetch(`${API_URL}/api/watermark/detect`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server error: ${response.status}`);
  }

  return response.json();
}
