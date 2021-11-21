import {useCallback, useEffect, useRef, useState} from "react";

const useGame = (frameRenderer: (context: CanvasRenderingContext2D,
                                 timestamp: number) => void
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const animationFrameId = useRef<number>();
  const animationStartFrame = useRef<number | null>();

  const renderer = useCallback((timestamp?: number) => {
    const canvasContext = canvasRef.current?.getContext("2d");
    if (animationStartFrame.current === null || animationStartFrame.current === undefined) {
      animationStartFrame.current = timestamp;
    }
    if (canvasContext && timestamp !== undefined && animationStartFrame.current !== undefined) {
      frameRenderer(canvasContext, timestamp - animationStartFrame.current);
    }
    if (isRunning) {
      animationFrameId.current = requestAnimationFrame(renderer);
    }
  }, [frameRenderer, isRunning]);

  const start = useCallback(() => {
    console.log("start!");
    setIsRunning(true);
    animationStartFrame.current = null;
    if (!animationFrameId.current) {
      animationFrameId.current = requestAnimationFrame(renderer);
    }
  }, [renderer]);

  const stop = useCallback(() => {
    console.log("stop!");
    setIsRunning(false);
  }, []);

  useEffect(() => {
    renderer();
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }
  }, [frameRenderer, isRunning, renderer]);

  return {canvasRef, start, stop, isRunning};
}

export default useGame;