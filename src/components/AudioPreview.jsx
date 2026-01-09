import { useEffect, useMemo, useRef, useState } from "react";
import { useCartStore } from "../store/cartStore";

function formatTime(sec) {
  if (!Number.isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function AudioPreview({ src, trackId }) {
  const audioRef = useRef(null);

  const playingId = useCartStore((s) => s.playingId);
  const setPlayingId = useCartStore((s) => s.setPlayingId);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [t, setT] = useState(0);

  const progress = useMemo(() => {
    if (!duration) return 0;
    return Math.min(100, Math.max(0, (t / duration) * 100));
  }, [t, duration]);

  // Stop this player if another track starts playing
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playingId !== trackId && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [playingId, trackId, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      setDuration(audio.duration || 0);
      setIsReady(true);
    };
    const onTime = () => setT(audio.currentTime || 0);
    const onEnd = () => {
      setIsPlaying(false);
      if (playingId === trackId) setPlayingId(null);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, [playingId, setPlayingId, trackId]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      // announce globally so other players stop
      setPlayingId(trackId);
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        // autoplay restrictions / user gesture issues
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
      if (playingId === trackId) setPlayingId(null);
    }
  };

  const onSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const next = (Number(e.target.value) / 100) * duration;
    audio.currentTime = next;
    setT(next);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    audio.muted = next;
    setMuted(next);
  };

  if (!src) return null;

  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="h-10 w-10 rounded-full bg-primary text-black font-bold hover:brightness-110 transition flex items-center justify-center"
            aria-label={isPlaying ? "Pause preview" : "Play preview"}
            title={isPlaying ? "Pause preview" : "Play preview"}
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>

          <div className="leading-tight">
            <p className="text-sm font-semibold">
              Audio Preview
              <span className="ml-2 text-xs text-muted">
                (30–60s)
              </span>
            </p>
            <p className="text-xs text-muted">
              {formatTime(t)} / {formatTime(duration)}
              {!isReady && <span className="ml-2">Loading…</span>}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleMute}
          className="text-xs text-muted hover:text-white transition"
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? "Unmute" : "Mute"}
        </button>
      </div>

      <div className="mt-3">
        <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-primary"
            style={{ width: `${progress}%` }}
          />
        </div>

        <input
          className="mt-2 w-full accent-[var(--tw-prose-links)]"
          type="range"
          min="0"
          max="100"
          value={Number.isFinite(progress) ? progress : 0}
          onChange={onSeek}
        />
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}
