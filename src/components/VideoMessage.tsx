import { useState, useRef, useEffect, useCallback } from 'react';
import { Check, ChevronRight } from 'lucide-react';

export interface VideoMessageProps {
  key?: string | number;
  videoUrl?: string;
  message?: string;
  avatarUrl: string;
  onEnded?: () => void;
}

function getYouTubeVideoId(rawUrl: string): string | null {
  if (!rawUrl) return null;
  const m = rawUrl.match(/(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  return m ? m[1] : null;
}

function isDirectVideoFile(url: string): boolean {
  if (!url) return false;
  const clean = url.split('?')[0].toLowerCase();
  return clean.endsWith('.mp4') || clean.endsWith('.webm') || clean.endsWith('.ogg') || clean.endsWith('.mov');
}

export function VideoMessage({ videoUrl, message, avatarUrl, onEnded }: VideoMessageProps) {
  const [isEnded, setIsEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasTriggeredRef = useRef(false);

  const rawUrl = videoUrl || 'https://www.image2url.com/r2/default/videos/1788282663673-f47140ee-13d0-4f21-9740-203d578478e7.mp4';
  const isDirect = isDirectVideoFile(rawUrl);
  const ytId = getYouTubeVideoId(rawUrl);

  const handleEnded = useCallback(() => {
    if (!hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      setIsEnded(true);
      onEnded?.();
    }
  }, [onEnded]);

  useEffect(() => {
    const vid = videoRef.current;
    if (isDirect && vid) {
      vid.addEventListener('ended', handleEnded);
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
      return () => {
        vid.removeEventListener('ended', handleEnded);
      };
    }
  }, [isDirect, handleEnded]);

  useEffect(() => {
    // Listen for youtube / wistia / iframe postMessage events if applicable
    const handleMessage = (ev: MessageEvent) => {
      try {
        if (typeof ev.data === 'string') {
          if (ev.data.includes('"event":"end"') || ev.data.includes('"state":"ended"') || ev.data.includes('"ended"')) {
            handleEnded();
          }
          const p = JSON.parse(ev.data);
          if ((p.event === 'onStateChange' && p.info === 0) || p.event === 'ended') {
            handleEnded();
          }
        } else if (typeof ev.data === 'object' && ev.data !== null) {
          if ((ev.data.event === 'onStateChange' && ev.data.info === 0) || ev.data.event === 'ended' || ev.data.type === 'ended') {
            handleEnded();
          }
        }
      } catch {
        // ignore parse error
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleEnded]);

  return (
    <div className="flex items-end self-start space-x-2 my-1 animate-pop-in max-w-[92%] sm:max-w-md w-full">
      <img
        src={avatarUrl}
        alt="Avatar"
        className="w-7 h-7 rounded-full flex-shrink-0 object-cover border border-[#333] mb-0.5"
      />
      <div className="bg-[#262626] border border-[#333]/50 rounded-2xl rounded-bl-sm p-3.5 text-white text-sm shadow-md overflow-hidden w-full">
        <div className="w-full">
          {isDirect ? (
            <div className="w-full rounded-xl overflow-hidden bg-black shadow-inner border border-neutral-800 flex items-center justify-center">
              <video
                ref={videoRef}
                className="w-full max-h-[520px] object-contain rounded-xl"
                src={rawUrl}
                controls
                playsInline
                autoPlay
              />
            </div>
          ) : ytId ? (
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner border border-neutral-800 relative">
              <iframe
                className="w-full h-full absolute inset-0"
                src={`https://www.youtube.com/embed/${ytId}?enablejsapi=1&autoplay=1&loop=0&controls=1&rel=0&modestbranding=1`}
                title="Vídeo NzShot"
                frameBorder="0"
                scrolling="no"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner border border-neutral-800 relative">
              <iframe
                className="w-full h-full absolute inset-0"
                src={rawUrl}
                title="Vídeo"
                frameBorder="0"
                scrolling="no"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}

          <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-[#333]/70 pt-2 text-xs text-neutral-400">
            {isEnded ? (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Check className="w-3.5 h-3.5" /> Vídeo finalizado
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-neutral-400">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping inline-block" /> Assistindo vídeo...
              </span>
            )}

            {!isEnded && (
              <button
                id="btn-skip-video"
                onClick={handleEnded}
                className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 bg-blue-950/40 px-2.5 py-1 rounded-md border border-blue-800/40 cursor-pointer active:scale-95 transition-transform"
              >
                Continuar <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {message && message !== '..' && (
            <div className="mt-2 text-neutral-200 text-sm leading-relaxed whitespace-pre-line">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
