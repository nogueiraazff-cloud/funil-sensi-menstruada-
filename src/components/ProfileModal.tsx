import { X, CheckCircle2 } from 'lucide-react';
import { AppConfig } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onRedirectToSales: () => void;
}

export function ProfileModal({ isOpen, onClose, config, onRedirectToSales }: ProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div
      id="profile-modal-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-pop-in"
      onClick={onClose}
    >
      <div
        id="profile-modal-card"
        className="bg-[#121212] border border-[#262626] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar relative shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#121212]/95 backdrop-blur-md px-4 py-3 border-b border-[#262626] flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 font-semibold text-white text-base">
            <span>{config.accountName}</span>
            {config.verified && (
              <CheckCircle2 className="w-4 h-4 text-[#3797F0] fill-[#3797F0] text-black" />
            )}
          </div>
          <button
            id="profile-modal-close-btn"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Fechar perfil"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-6 mb-4">
            <div className="relative w-20 h-20 flex-shrink-0 p-0.5 rounded-full bg-gradient-to-tr from-[#FFD600] via-[#FF0069] to-[#D300C5]">
              <div className="bg-black p-0.5 rounded-full w-full h-full">
                <img
                  src={config.avatarUrl}
                  alt={config.accountName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 grid grid-cols-3 text-center gap-2">
              <div>
                <div className="font-bold text-white text-sm">{config.postsCount}</div>
                <div className="text-[11px] text-neutral-400">publicações</div>
              </div>
              <div>
                <div className="font-bold text-white text-sm">{config.followersCount}</div>
                <div className="text-[11px] text-neutral-400">seguidores</div>
              </div>
              <div>
                <div className="font-bold text-white text-sm">{config.followingCount}</div>
                <div className="text-[11px] text-neutral-400">seguindo</div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-white text-sm">{config.accountName}</h3>
            <span className="inline-block text-xs text-neutral-400 font-normal">
              {config.category}
            </span>
            <div className="text-xs text-neutral-200 mt-1 leading-relaxed space-y-0.5">
              {config.bio.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              id="profile-modal-access-site-btn"
              onClick={onRedirectToSales}
              className="bg-[#3797F0] hover:bg-blue-600 active:scale-95 text-white font-semibold py-2 rounded-lg text-xs transition-all text-center cursor-pointer"
            >
              Acessar Site Oficial
            </button>
            <button
              id="profile-modal-direct-btn"
              onClick={onClose}
              className="bg-[#262626] hover:bg-[#333] active:scale-95 text-white font-semibold py-2 rounded-lg text-xs transition-all text-center cursor-pointer"
            >
              Conversar no Direct
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
