import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type {
  AttackSimulationRequest,
  AttackSimulationResponse,
} from "@/lib/types";

/**
 * Image Attack Laboratory service communicating with FastAPI backend.
 * Ready for Phase 2 integration. No fake data or mock algorithms.
 */
export const attackService = {
  /**
   * Submit an image to distortion attacks (JPEG, crop, resize, noise, brightness, contrast).
   */
  async simulate(
    request: AttackSimulationRequest
  ): Promise<AttackSimulationResponse> {
    return apiClient<AttackSimulationResponse>(API_ENDPOINTS.ATTACK.SIMULATE, {
      method: "POST",
      body: JSON.stringify(request),
    });
  },
};

