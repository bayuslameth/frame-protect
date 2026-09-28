const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface VerifyRequest {
  original_image: File;
  watermarked_image: File;
  watermark_type: "text" | "logo";
  watermark_text?: string;
  watermark_file?: File;
  secret_key: string;
}

export interface VerifyResponse {
  success: boolean;
  watermark_type?: string;
  recovered_text?: string;
  recovered_logo?: string;
  metrics: {
    psnr: {
      value: number;
      unit: "dB";
    };
    nc: {
      value: number;
    };
    ber: {
      value: number;
      total_bits: number;
      error_bits: number;
    };
  };
}

export async function verifyWatermark(req: VerifyRequest): Promise<VerifyResponse> {
  const formData = new FormData();
  formData.append("original_image", req.original_image);
  formData.append("watermarked_image", req.watermarked_image);
  formData.append("watermark_type", req.watermark_type);
  if (req.watermark_text) formData.append("watermark_text", req.watermark_text);
  if (req.watermark_file) formData.append("watermark_file", req.watermark_file);
  formData.append("secret_key", req.secret_key);

  const response = await fetch(`${API_URL}/api/metrics/verify`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server error: ${response.status}`);
  }

  return response.json();
}
