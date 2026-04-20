// services/aiConfig.ts
// Server-side AI backend configuration

const IS_DEV = __DEV__;

// ⚡ Replace with your machine's local IP (printed by start.sh)
const DEV_URL = "http://YOUR_LOCAL_IP:8000";
const PROD_URL = "https://your-production-server.com";

export const AI_CONFIG = {
  baseUrl: IS_DEV ? DEV_URL : PROD_URL,
  endpoints: {
    health: "/health",
    analyzeBase64: "/analyze/base64",
    analyzePose: "/analyze/pose",
    analyzeBall: "/analyze/ball",
    sessionStart: "/session/start",
    sessionFrame: "/session/{id}/frame",
    sessionEnd: "/session/{id}/end",
  },
  // Frame capture settings
  captureIntervalMs: 200,       // ms between captures
  imageQuality: 0.5,            // 0-1 JPEG quality (lower = faster upload)
  imageWidth: 640,              // resize before sending
  timeoutMs: 5000,              // request timeout
};
