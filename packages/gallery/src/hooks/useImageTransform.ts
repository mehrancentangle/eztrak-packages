import { useState, useCallback } from "react";
import { clampRotation, clampZoom } from "../utils/imageUtils";

export interface ImageTransformState {
  rotation: number;
  zoom: number;
  panX: number;
  panY: number;
}

const INITIAL_STATE: ImageTransformState = {
  rotation: 0,
  zoom: 1,
  panX: 0,
  panY: 0,
};

export function useImageTransform() {
  const [transform, setTransform] = useState<ImageTransformState>(INITIAL_STATE);

  const rotate = useCallback((degrees = 90) => {
    setTransform((prev) => ({
      ...prev,
      rotation: clampRotation(prev.rotation, degrees),
    }));
  }, []);

  const zoomIn = useCallback((step = 0.25) => {
    setTransform((prev) => ({
      ...prev,
      zoom: clampZoom(prev.zoom, step),
    }));
  }, []);

  const zoomOut = useCallback((step = 0.25) => {
    setTransform((prev) => ({
      ...prev,
      zoom: clampZoom(prev.zoom, -step),
    }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setTransform((prev) => ({ ...prev, zoom: clampZoom(zoom, 0) }));
  }, []);

  const pan = useCallback((dx: number, dy: number) => {
    setTransform((prev) => ({
      ...prev,
      panX: prev.panX + dx,
      panY: prev.panY + dy,
    }));
  }, []);

  const reset = useCallback(() => {
    setTransform(INITIAL_STATE);
  }, []);

  const transformStyle: React.CSSProperties = {
    transform: `translate(${transform.panX}px, ${transform.panY}px) rotate(${transform.rotation}deg) scale(${transform.zoom})`,
    transformOrigin: "center center",
    transition: "transform 0.2s ease",
  };

  return {
    transform,
    transformStyle,
    rotate,
    zoomIn,
    zoomOut,
    setZoom,
    pan,
    reset,
  };
}
