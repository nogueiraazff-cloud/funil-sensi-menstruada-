import { useState, useEffect } from 'react';
import { Phone, PhoneOff, Video, Mic, Volume2 } from 'lucide-react';
import { AppConfig } from '../types';

interface CallModalProps {
  type: 'audio' | 'video' | null;
  onClose: () => void;
  config: AppConfig;
}

export function CallModal({ type, onClose, config }: CallModalProps) {
  const [callStatus, setCallStatus] = useState<'chamando' | 'conectando' | 'ocupado'>('chamando');

  useEffect(() => {
    if (!type) return;
    setCallStatus('chamando');
    const t1 = setTimeout(() => {
      setCallStatus('ocupado');
    }, 3500);

    const t2 = setTimeout(() => {
      onClose();
    }, 6000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [type, onClose]);

  if (!type) return null;

  return (
    <div
      id="call-modal-overlay"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-8 animate-pop-in text-white"
    >
      <div className="flex flex-col items-center mt-12">
        <div className="relative mb-4">
          <img
            src={config.avatarUrl}
            alt={config.accountName}
            className="w-28 h-28 rounded-full object-cover border-2 border-neutral-700 shadow-2xl animate-pulse"
          />
          <div className="absolute -bottom-1 right-1 p-2 bg-[#3797F0] rounded-full ring-4 ring-black">
            {type === 'video' ? (
              <Video className="w-4 h-4 text-white" />
            ) : (
              <Phone className="w-4 h-4 text-white" />
            )}
          </div>
        </div>

        <h2 className="text-xl font-semibold tracking-tight">{config.accountName}</h2>
        <p className="text-sm text-neutral-400 mt-1 font-medium">
          {callStatus === 'chamando' && 'Chamando...'}
          {callStatus === 'conectando' && 'Conectando linha...'}
          {callStatus === 'ocupado' && 'Atendimento em andamento no Direct'}
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 mb-10 w-full max-w-xs">
        <div className="flex items-center justify-center gap-6 text-neutral-400">
          <div className="p-3.5 bg-neutral-800/80 rounded-full">
            <Mic className="w-5 h-5 text-neutral-300" />
          </div>
          <div className="p-3.5 bg-neutral-800/80 rounded-full">
            <Volume2 className="w-5 h-5 text-neutral-300" />
          </div>
        </div>

        <button
          id="btn-end-call"
          onClick={onClose}
          className="w-16 h-16 bg-red-600 hover:bg-red-700 active:scale-95 rounded-full flex items-center justify-center shadow-lg transition-transform cursor-pointer"
          aria-label="Encerrar chamada"
        >
          <PhoneOff className="w-7 h-7 text-white" />
        </button>
      </div>
    </div>
  );
}
