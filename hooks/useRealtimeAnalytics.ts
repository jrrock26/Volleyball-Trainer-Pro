// hooks/useRealtimeAnalytics.ts
// Hook for real-time AI analytics during recording

import { useCallback, useEffect, useRef, useState } from 'react';
import { imageBase64ToTensor, tfjsAnalytics } from '../services/tfjsAnalytics';

interface AnalyticsFrame {
  pose: any;
  ball: any;
  timestamp: number;
}

interface RealtimeAnalyticsState {
  isInitialized: boolean;
  isAnalyzing: boolean;
  currentFrame: AnalyticsFrame | null;
  error: string | null;
}

export function useRealtimeAnalytics() {
  const [state, setState] = useState<RealtimeAnalyticsState>({
    isInitialized: false,
    isAnalyzing: false,
    currentFrame: null,
    error: null
  });

  const analysisRef = useRef<AnalyticsFrame[]>([]);

  useEffect(() => {
    const initialize = async () => {
      try {
        await tfjsAnalytics.initialize();
        setState(prev => ({ ...prev, isInitialized: true, error: null }));
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setState(prev => ({
          ...prev,
          error: `Failed to initialize AI models: ${message}`
        }));
      }
    };

    initialize();

    return () => {
      tfjsAnalytics.dispose();
    };
  }, []);

  const analyzeFrame = useCallback(async (imageBase64: string) => {
    if (!state.isInitialized) return null;

    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      // Convert base64 to tensor
      const imageTensor = await imageBase64ToTensor(imageBase64);
      const result = await tfjsAnalytics.analyzeFrame(imageTensor);

      // Cleanup tensor
      imageTensor.dispose();

      const frame: AnalyticsFrame = {
        pose: result.pose,
        ball: result.ball,
        timestamp: result.timestamp
      };

      analysisRef.current.push(frame);
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        currentFrame: frame
      }));

      return frame;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: `Analysis failed: ${message}`
      }));
      return null;
    }
  }, [state.isInitialized]);

  const getAnalysisHistory = useCallback(() => {
    return [...analysisRef.current];
  }, []);

  const clearAnalysis = useCallback(() => {
    analysisRef.current = [];
    setState(prev => ({ ...prev, currentFrame: null }));
  }, []);

  return {
    ...state,
    analyzeFrame,
    getAnalysisHistory,
    clearAnalysis
  };
}