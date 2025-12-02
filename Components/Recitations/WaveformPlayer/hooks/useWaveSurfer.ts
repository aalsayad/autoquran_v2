import { useEffect, useRef, useState, MutableRefObject } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions";

type UseWaveSurferProps = {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  audioUrl: string;
  onReady?: (ws: WaveSurfer) => void;
};

export function useWaveSurfer({
  containerRef,
  audioUrl,
  onReady,
}: UseWaveSurferProps) {
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const regionsPluginRef = useRef<RegionsPlugin | null>(null);
  const isDestroyingRef = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reset container
    container.innerHTML = "";

    const regionsPlugin = RegionsPlugin.create();
    regionsPluginRef.current = regionsPlugin;

    const ws = WaveSurfer.create({
      container,
      waveColor: "rgba(172, 176, 182, 1)", // Gray-300 (Neutral)
      progressColor: "rgb(75, 85, 99)", // Gray-600 (Neutral Dark)
      cursorColor: "rgba(255, 0, 0, 1)", // Red
      cursorWidth: 1,
      barWidth: 2,
      barGap: 1,
      barRadius: 0,
      height: 96,
      normalize: true,
      plugins: [regionsPlugin],
    });

    wavesurferRef.current = ws;

    ws.load(audioUrl).catch((e) => {
      // Ignore AbortErrors during load (e.g. when switching tracks quickly)
      if (e.name === "AbortError") return;
      console.error("WaveSurfer load error:", e);
    });

    ws.on("ready", () => {
      setIsReady(true);
      setDuration(ws.getDuration());
      if (onReady) onReady(ws);
    });

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));
    ws.on("timeupdate", (time) => setCurrentTime(time));

    const abortErrorHandler = (event: PromiseRejectionEvent) => {
      if (event.reason?.name === "AbortError" && isDestroyingRef.current) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("unhandledrejection", abortErrorHandler);

    return () => {
      isDestroyingRef.current = true;
      
      try {
        ws.destroy();
      } catch (e) {
        // Ignore AbortErrors during cleanup
        console.warn("WaveSurfer cleanup error:", e);
      }
      
      // Remove the event listener AFTER destroy, so it can catch the rejection caused by destroy()
      window.removeEventListener("unhandledrejection", abortErrorHandler);
      
      wavesurferRef.current = null;
      regionsPluginRef.current = null;
    };
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  const handleZoomChange = (zoom: number) => {
    if (wavesurferRef.current) {
      wavesurferRef.current.zoom(zoom);
    }
  };

  return {
    wavesurfer: wavesurferRef.current,
    regionsPlugin: regionsPluginRef.current,
    isReady,
    isPlaying,
    currentTime,
    duration,
    handlePlayPause,
    handleZoomChange,
  };
}
