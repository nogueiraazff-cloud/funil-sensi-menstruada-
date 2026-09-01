export interface ChatOption {
  text: string;
  next?: number;
  action?: 'redirect' | 'checkout_confirm' | string;
  highlight?: boolean;
  confirmationMessage?: string;
  confirmationButtonText?: string;
  checkoutUrl?: string;
}

export interface FlowStep {
  message?: string;
  delay?: number;
  options?: ChatOption[];
  isAudio?: boolean;
  audioUrl?: string;
  isVideo?: boolean;
  videoUrl?: string;
  next?: number;
}

export interface AppConfig {
  accountName: string;
  verified: boolean;
  avatarUrl: string;
  category: string;
  followersCount: string;
  postsCount: string;
  followingCount: string;
  bio: string[];
  salesPageUrl: string;
  onlineStatus: string;
  videoEmbedUrl: string;
  flow: FlowStep[];
}

export interface ChatMessageItem {
  id: string;
  sender: 'bot' | 'user';
  message?: string;
  isAudio?: boolean;
  audioUrl?: string;
  isVideo?: boolean;
  videoUrl?: string;
  stepIndex?: number;
  timestamp: Date;
}
