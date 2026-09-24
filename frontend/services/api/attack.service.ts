const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface AttackTestRequest {
  watermarked_image: File;
  original_watermark_text: string;
  secret_key: string;
  attack_type: string;
  parameter: number;
}

export interface AttackTestResponse {
  success: boolean;
  attacked_image: string; // base64 URL
  attack_type: string;
  parameter: number;
  original_dimensions: { width: number; height: number };
  attacked_dimensions: { width: number; height: number };
  extraction_status: "DETECTED" | "FAILED";
  extracted_watermark: string;
  psnr: number | null;
  nc: number | null;
  ber: number | null;
}

export async function testAttack(req: AttackTestRequest): Promise<AttackTestResponse> {
  const formData = new FormData();
  formData.append("watermarked_image", req.watermarked_image);
  formData.append("original_watermark_text", req.original_watermark_text);
  formData.append("secret_key", req.secret_key);
  formData.append("attack_type", req.attack_type);
  formData.append("parameter", req.parameter.toString());

  const response = await fetch(`${API_URL}/api/attacks/test`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server error: ${response.status}`);
  }

  return response.json();
}
