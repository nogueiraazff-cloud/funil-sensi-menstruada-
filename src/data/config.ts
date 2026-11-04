import { AppConfig } from '../types';

export const config: AppConfig = {
  accountName: 'nzw sensi',
  verified: true,
  avatarUrl: 'https://i.ibb.co/spfqD5tq/e0b0664a-cfb1-4f6f-8fd8-ceac1dba211e.png',
  category: 'Instagram • @nzwsensi segue você ',
  followersCount: '15 mil',
  postsCount: '15',
  followingCount: '214',
  bio: [
    '🎯 A melhor sensibilidade & calibrador para mobile.',
    '🛡️ 100% Seguro, Anti-Ban & Testado.',
    '⚡ Suba capa com qualquer arma sem esforço.',
  ],
  salesPageUrl: 'https://nzwsensi.vercel.app/',
  onlineStatus: 'Online agora',
  videoEmbedUrl: 'https://www.image2url.com/r2/default/videos/1788282663673-f47140ee-13d0-4f21-9740-203d578478e7.mp4',
  flow: [
    {
      message: '',
      delay: 2056,
      options: [],
      isAudio: true,
      audioUrl: 'https://www.image2url.com/r2/default/audio/1793766911088-ae3401cd-b8f8-4b3d-84cd-39c92411f183.mp3',
    },
    {
      message: 'Qual dispositivo que você usa atualmente para jogar?  ',
      delay: 2045,
      options: [
        { text: 'ANDROID', next: 2 },
        { text: 'IPHONE', next: 2 },
        { text: 'EMULADOR/PC', next: 2 },
      ],
    },
    {
      message: '',
      delay: 2000,
      options: [],
      isAudio: true,
      audioUrl: 'https://www.image2url.com/r2/default/audio/1793769259911-cc80e754-eb30-4ddf-b327-385a4c8b18bc.mp3',
    },
    {
      message: '⚡ QUER O PAINEL NZW SENSI ? ⚡ Assista até o final para ativá-lo! 🎯📲 São só 50 segundinhos! Não perca! ⏳👇 ',
      delay: 2000,
      options: [],
      isVideo: false,
      videoUrl: 'https://youtu.be/Nn30ROKqckc',
    },
    {
      message: '',
      delay: 2000,
      options: [],
      isVideo: true,
      videoUrl: 'https://www.image2url.com/r2/default/videos/1793770594253-e6ccd97e-2819-424d-84d7-33b0b9c0ef2b.mp4',
    },
    {
      message: '🛒 Finalizando sua compra agora! 🚀🎯🎧 Escute o áudio – só 54 segundinhos! 🔊👇',
      delay: 2000,
      options: [
        {
          text: 'TENHO INTERESSE!',
          action: 'checkout_confirm',
          checkoutUrl: 'https://nzwsensi.vercel.app/',
          confirmationMessage: '✅ Mandou bem! Toque no botão abaixo para liberar o painel  e receber seus bônus! ⚡🎁👇',
          confirmationButtonText: 'ATIVAR AGORA MEU ACESSO!',
          highlight: true,
        },
      ],
      isAudio: true,
      audioUrl: 'https://www.image2url.com/r2/default/audio/1793771851984-7d9f9d37-cde3-4ca3-aaf6-5a8d08c1764f.mp3',
    },
  ],
};
