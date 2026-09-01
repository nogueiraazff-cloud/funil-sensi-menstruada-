import { useState, useRef, useEffect, useCallback, MouseEvent } from 'react';
import { Play, Pause, Mic } from 'lucide-react';

export interface AudioMessageProps {
  key?: string | number;
  audioUrl: string;
  avatarUrl: string;
  onEnded?: () => void;
}

const WAVE_BARS = [30, 45, 75, 90, 60, 40, 80, 100, 85, 65, 45, 90, 100, 70, 50, 85, 95, 60, 40, 75, 90, 55, 35, 70, 85, 60, 40, 30];

export function AudioMessage({ audioUrl, avatarUrl, onEnded }: AudioMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(16);
  const [speed, setSpeed] = useState<1 | 1.5 | 2>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasEndedRef = useRef(false);

  const handleEnded = useCallback(() => {
    if (!hasEndedRef.current) {
      hasEndedRef.current = true;
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      setCurrentTime(0);
      onEnded?.();
    }
  }, [onEnded]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', handleEnded);

    // Try auto-play with audio muted/unmuted catch
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay policy prevented playback, user can tap play button
          setIsPlaying(false);
        });
    }

    // Safety fallback timer if audio doesn't play or user doesn't interact within 25s
    const fallbackTimer = setTimeout(() => {
      if (!hasEndedRef.current && audio.paused && audio.currentTime === 0) {
        handleEnded();
      }
    }, 25000);

    return () => {
      clearTimeout(fallbackTimer);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [handleEnded]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  };

  const toggleSpeed = () => {
    const nextSpeed = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1;
    setSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const handleSeek = (e: MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, clickX / rect.width));
    audio.currentTime = progress * duration;
    setCurrentTime(audio.currentTime);
  };

  const formatSecs = (secs: number) => {
    if (isNaN(secs) || secs === 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-end self-start space-x-2 my-1 animate-pop-in max-w-[92%] sm:max-w-md w-full">
      <img
        src={avatarUrl}
        alt="Avatar"
        className="w-7 h-7 rounded-full flex-shrink-0 object-cover border border-[#333] mb-0.5"
      />
      <div className="bg-[#262626] border border-[#333]/60 rounded-2xl rounded-bl-sm p-3 text-white shadow-md w-full max-w-[290px] sm:max-w-[320px] select-none">
        <audio ref={audioRef} src={audioUrl} preload="auto" playsInline />
        <div className="flex items-center gap-3">
          <button
            id="audio-play-toggle-btn"
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-[#3797F0] hover:bg-[#2878c7] active:scale-95 text-white flex items-center justify-center flex-shrink-0 transition-all shadow-md cursor-pointer"
            aria-label={isPlaying ? 'Pausar áudio' : 'Reproduzir áudio'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white ml-0.5" />
            )}
          </button>

          <div className="flex-1 flex flex-col justify-center min-w-0">
            <div
              id="waveform-interactive-area"
              onClick={handleSeek}
              className="flex items-center gap-[2.5px] h-7 cursor-pointer py-1"
            >
              {WAVE_BARS.map((barHeight, idx) => {
                const barPercent = (idx / WAVE_BARS.length) * 100;
                const isPlayed = barPercent <= progressPercent;
                return (
                  <div
                    key={idx}
                    className={`flex-1 rounded-full transition-colors duration-100 min-w-[2px] ${
                      isPlayed ? 'bg-[#3797F0]' : 'bg-[#525252]'
                    }`}
                    style={{ height: `${Math.max(20, (barHeight / 100) * 24)}px` }}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-0.5 font-mono">
              <span className="flex items-center gap-1">
                <Mic className="w-3 h-3 text-[#3797F0]" />
                <span>{isPlaying ? formatSecs(currentTime) : formatSecs(duration)}</span>
              </span>

              <button
                id="audio-speed-btn"
                onClick={toggleSpeed}
                className="text-[10px] font-sans font-semibold px-1.5 py-0.5 rounded bg-[#1a1a1a] hover:bg-[#333] text-neutral-300 transition-colors cursor-pointer"
              >
                {speed}x
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
