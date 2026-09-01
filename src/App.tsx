import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, CheckCircle2, Phone, Video, Sparkles, ArrowRight } from 'lucide-react';
import { config } from './data/config';
import { ChatOption, ChatMessageItem } from './types';
import { AudioMessage } from './components/AudioMessage';
import { VideoMessage } from './components/VideoMessage';
import { ProfileModal } from './components/ProfileModal';
import { CallModal } from './components/CallModal';

export default function App() {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [currentOptions, setCurrentOptions] = useState<ChatOption[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [activeCallType, setActiveCallType] = useState<'audio' | 'video' | null>(null);
  
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const stepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior,
      });
    }
  }, []);

  const redirectToSales = useCallback((customUrl?: string) => {
    const salesUrl = customUrl || config.salesPageUrl || 'https://noskillsensi.com.br';
    const search = window.location.search || '';
    const finalUrl = salesUrl.includes('?') && search.startsWith('?')
      ? `${salesUrl}&${search.substring(1)}`
      : `${salesUrl}${search}`;
    window.location.href = finalUrl;
  }, []);

  const runChatStep = useCallback((stepIdx: number) => {
    if (!config.flow || stepIdx >= config.flow.length) return;

    const step = config.flow[stepIdx];
    setIsTyping(true);
    setCurrentOptions([]);
    scrollToBottom();

    if (stepTimerRef.current) clearTimeout(stepTimerRef.current);

    const delay = step.delay !== undefined ? step.delay : 1500;

    stepTimerRef.current = setTimeout(() => {
      setIsTyping(false);

      const newMsg: ChatMessageItem = {
        id: `bot_${stepIdx}_${Date.now()}`,
        sender: 'bot',
        message: step.message,
        isAudio: step.isAudio,
        audioUrl: step.audioUrl,
        isVideo: step.isVideo,
        videoUrl: step.videoUrl,
        stepIndex: stepIdx,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMsg]);
      scrollToBottom();

      // If options exist, show them
      if (step.options && step.options.length > 0) {
        setTimeout(() => {
          setCurrentOptions(step.options || []);
          scrollToBottom();
        }, 300);
      }
      // If audio or video, wait for their onEnded trigger to advance
      else if (step.isAudio || step.isVideo) {
        // Advanced by callback
      }
      // Otherwise auto-advance to next step
      else {
        const nextIdx = step.next !== undefined ? step.next : stepIdx + 1;
        if (nextIdx < config.flow.length) {
          runChatStep(nextIdx);
        }
      }
    }, delay);
  }, [scrollToBottom]);

  const handleSelectOption = useCallback((option: ChatOption) => {
    // Add user message bubble
    const userMsg: ChatMessageItem = {
      id: `user_${Date.now()}`,
      sender: 'user',
      message: option.text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setCurrentOptions([]);
    scrollToBottom();

    // Intermediate checkout confirmation action
    if (option.action === 'checkout_confirm' || option.confirmationMessage || option.confirmationButtonText) {
      setIsTyping(true);
      scrollToBottom();

      setTimeout(() => {
        setIsTyping(false);
        const confirmMsg: ChatMessageItem = {
          id: `bot_confirm_${Date.now()}`,
          sender: 'bot',
          message: option.confirmationMessage || '✅ Mandou bem! Toque no botão abaixo para liberar o painel hack e receber seus bônus! ⚡🎁👇',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, confirmMsg]);
        scrollToBottom();

        setTimeout(() => {
          setCurrentOptions([
            {
              text: option.confirmationButtonText || 'ATIVAR O PAINEL HACK!',
              action: 'redirect',
              checkoutUrl: option.checkoutUrl || config.salesPageUrl,
              highlight: true,
            },
          ]);
          scrollToBottom();
        }, 300);
      }, 1200);
      return;
    }

    if (option.action === 'redirect') {
      setTimeout(() => {
        redirectToSales(option.checkoutUrl);
      }, 300);
      return;
    }

    if (option.next !== undefined) {
      runChatStep(option.next);
    }
  }, [redirectToSales, runChatStep, scrollToBottom]);

  // Initial chat start
  useEffect(() => {
    setMessages([]);
    setCurrentOptions([]);
    const startTimer = setTimeout(() => {
      runChatStep(0);
    }, 400);

    return () => {
      clearTimeout(startTimer);
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    };
  }, [runChatStep]);

  // Auto scroll whenever messages or typing change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, currentOptions, scrollToBottom]);

  return (
    <main className="bg-black text-white antialiased flex items-center justify-center min-h-screen">
      <div className="w-full max-w-lg h-[100dvh] bg-black flex flex-col relative border-x border-[#1a1a1a] shadow-2xl overflow-hidden">
        {/* Instagram Direct Header */}
        <header className="bg-black/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-[#262626] flex-shrink-0 z-20 sticky top-0">
          <div className="flex items-center gap-3">
            <button
              id="header-back-btn"
              onClick={() => setIsProfileOpen(true)}
              className="text-white hover:opacity-75 transition-opacity p-1 -ml-1 cursor-pointer"
              aria-label="Voltar e ver perfil"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>

            <button
              id="header-profile-btn"
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="relative">
                <img
                  id="header-avatar-img"
                  src={config.avatarUrl}
                  alt={config.accountName}
                  className="w-10 h-10 rounded-full object-cover border border-[#333] group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-black"></span>
              </div>

              <div>
                <h1 className="font-semibold text-white text-sm flex items-center gap-1.5 leading-tight">
                  <span>{config.accountName}</span>
                  {config.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3797F0] fill-[#3797F0] text-black" />
                  )}
                </h1>
                <p className="text-[11px] text-[#A8A8A8] font-normal leading-none mt-0.5">
                  {config.onlineStatus}
                </p>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-3 text-white">
            <button
              id="header-audio-call-btn"
              onClick={() => setActiveCallType('audio')}
              className="p-1.5 hover:opacity-75 transition-opacity cursor-pointer"
              aria-label="Iniciar chamada de voz"
            >
              <Phone className="w-5 h-5 stroke-[2]" />
            </button>
            <button
              id="header-video-call-btn"
              onClick={() => setActiveCallType('video')}
              className="p-1.5 hover:opacity-75 transition-opacity cursor-pointer"
              aria-label="Iniciar chamada de vídeo"
            >
              <Video className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        </header>

        {/* Chat Conversation Scroll Area */}
        <div
          ref={chatContainerRef}
          id="chat-scroll-container"
          className="flex-1 p-4 overflow-y-auto no-scrollbar flex flex-col space-y-1.5"
        >
          {/* Top Profile Intro Card */}
          <div className="text-center my-6 flex-shrink-0 flex flex-col items-center animate-fade-in">
            <div className="relative w-24 h-24 mx-auto mb-2.5 p-[2.5px] rounded-full bg-gradient-to-tr from-[#FFD600] via-[#FF0069] to-[#D300C5] shadow-lg">
              <div className="bg-black p-0.5 rounded-full w-full h-full">
                <img
                  src={config.avatarUrl}
                  alt={config.accountName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <h2 className="font-semibold text-white text-base tracking-tight flex items-center gap-1">
              <span>{config.accountName}</span>
              {config.verified && (
                <CheckCircle2 className="w-4 h-4 text-[#3797F0] fill-[#3797F0] text-black" />
              )}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">{config.category}</p>
            <p className="text-xs text-neutral-500 mt-1">
              {config.followersCount} seguidores • {config.postsCount} publicações
            </p>
            <button
              id="btn-view-profile-hero"
              onClick={() => setIsProfileOpen(true)}
              className="mt-3 bg-[#262626] hover:bg-[#333333] active:scale-95 text-white text-xs font-semibold px-5 py-2 rounded-lg transition-all duration-150 border border-neutral-800 cursor-pointer"
            >
              Ver perfil
            </button>
          </div>

          {/* Messages list */}
          <div id="messages-list-wrapper" className="flex flex-col space-y-1.5">
            {messages.map((msg, index) => {
              if (msg.sender === 'user') {
                return (
                  <div
                    key={msg.id || index}
                    className="flex justify-end self-end my-1 animate-pop-in max-w-[85%] sm:max-w-xs ml-auto"
                  >
                    <div className="bg-[#3797F0] px-4 py-2.5 rounded-2xl rounded-br-sm text-white text-sm shadow-sm select-none break-words">
                      <p>{msg.message}</p>
                    </div>
                  </div>
                );
              }

              // Bot audio message
              if (msg.isAudio && msg.audioUrl) {
                const nextIdx = (msg.stepIndex !== undefined ? msg.stepIndex + 1 : index + 1);
                return (
                  <AudioMessage
                    key={msg.id || index}
                    audioUrl={msg.audioUrl}
                    avatarUrl={config.avatarUrl}
                    onEnded={() => {
                      if (nextIdx < config.flow.length) {
                        setTimeout(() => {
                          runChatStep(nextIdx);
                        }, 600);
                      }
                    }}
                  />
                );
              }

              // Bot video message
              if (msg.isVideo) {
                const nextIdx = (msg.stepIndex !== undefined ? msg.stepIndex + 1 : index + 1);
                return (
                  <VideoMessage
                    key={msg.id || index}
                    videoUrl={msg.videoUrl}
                    message={msg.message}
                    avatarUrl={config.avatarUrl}
                    onEnded={() => {
                      if (nextIdx < config.flow.length) {
                        setTimeout(() => {
                          runChatStep(nextIdx);
                        }, 500);
                      }
                    }}
                  />
                );
              }

              // Bot standard text bubble
              if (!msg.message || msg.message.trim() === '') return null;

              return (
                <div
                  key={msg.id || index}
                  className="flex items-end self-start space-x-2 my-1 animate-pop-in max-w-[92%] sm:max-w-md"
                >
                  <img
                    src={config.avatarUrl}
                    alt={config.accountName}
                    className="w-7 h-7 rounded-full flex-shrink-0 object-cover border border-[#333] mb-0.5"
                  />
                  <div className="bg-[#262626] border border-[#333]/50 rounded-2xl rounded-bl-sm p-3.5 text-white text-sm shadow-md overflow-hidden w-full">
                    <div className="text-neutral-100 text-sm leading-relaxed whitespace-pre-line">
                      {msg.message}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Typing Indicator */}
          {isTyping && (
            <div
              id="bot-typing-indicator"
              className="flex items-end self-start space-x-2 my-1.5 animate-pop-in"
            >
              <img
                src={config.avatarUrl}
                alt="Typing"
                className="w-7 h-7 rounded-full flex-shrink-0 object-cover border border-[#333]"
              />
              <div className="bg-[#262626] px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5 border border-[#303030]/60 shadow-sm">
                <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
        </div>

        {/* Options Button Bar */}
        {currentOptions.length > 0 && (
          <div
            id="chat-options-container"
            className="p-3.5 sm:p-4 border-t border-[#262626] bg-black/90 backdrop-blur-sm mt-auto flex-shrink-0 z-10 animate-pop-in"
          >
            <div className="flex flex-col items-center justify-center gap-2.5 max-w-lg mx-auto w-full">
              {currentOptions.map((opt, idx) => {
                const isHighlight =
                  opt.highlight ||
                  opt.action === 'redirect' ||
                  opt.action === 'checkout_confirm';

                return (
                  <button
                    key={idx}
                    id={`chat-option-btn-${idx}`}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full text-center font-semibold py-3 px-4 rounded-full text-sm transition-all duration-200 cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2 ${
                      isHighlight
                        ? 'bg-gradient-to-r from-[#3797F0] to-[#2563EB] text-white shadow-lg shadow-blue-500/25 hover:brightness-110 border border-blue-400/30'
                        : 'border border-[#3797F0] text-[#3797F0] hover:bg-[#3797F0] hover:text-white bg-transparent'
                    }`}
                  >
                    {isHighlight && <Sparkles className="w-4 h-4 animate-pulse" />}
                    <span>{opt.text}</span>
                    {isHighlight && <ArrowRight className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Instagram Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        config={config}
        onRedirectToSales={() => {
          setIsProfileOpen(false);
          redirectToSales();
        }}
      />

      {/* Realistic Voice/Video Call Modal */}
      <CallModal
        type={activeCallType}
        onClose={() => setActiveCallType(null)}
        config={config}
      />
    </main>
  );
}
