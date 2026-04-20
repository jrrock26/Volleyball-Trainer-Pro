// services/aiApi.ts
// HTTP client for server-side AI backend

import { AI_CONFIG } from "./aiConfig";

interface AnalysisResult {
  pose: {
    keypoints: Array<{ name: string; x: number; y: number; confidence: number }>;
    angles: Record<string, number>;
    action: string;
    formScore: number;
  } | null;
  ball: {
    detected: boolean;
    position: { x: number; y: number } | null;
    speed: { mph: number; kmh: number } | null;
    trajectory: string | null;
    confidence: number;
  } | null;
  timestamp: number;
}

// Check if AI backend is reachable
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(
      `${AI_CONFIG.baseUrl}${AI_CONFIG.endpoints.health}`,
      { method: "GET", signal: AbortSignal.timeout(3000) }
    );
    return response.ok;
  } catch {
    return false;
  }
}

// Send a base64 frame for full analysis (pose + ball + velocity)
export async function analyzeFrame(
  base64Image: string
): Promise<AnalysisResult | null> {
  try {
    const response = await fetch(
      `${AI_CONFIG.baseUrl}${AI_CONFIG.endpoints.analyzeBase64}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
        signal: AbortSignal.timeout(AI_CONFIG.timeoutMs),
      }
    );

    if (!response.ok) {
      console.warn("AI analyze failed:", response.status);
      return null;
    }

    return await response.json();
  } catch (err) {
    console.warn("AI analyze error:", err);
    return null;
  }
}
