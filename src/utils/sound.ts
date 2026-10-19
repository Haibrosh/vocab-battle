// Sound & Pronunciation utility for Parroto Vocab Battle

const SOUND_FILES = {
  correct: '/sounds/correct.mp3',
  complete: '/sounds/complete.mp3',
  notice: '/sounds/notice.mp3',
  wrong: '',
} as const;

type SoundType = keyof typeof SOUND_FILES;

class SoundManager {
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private wordAudioElement: HTMLAudioElement | null = null;
  public enabled = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vb_sound_enabled');
      if (saved !== null) {
        this.enabled = saved === 'true';
      }
      // Preload game sound effects
      (['correct', 'complete', 'notice'] as const).forEach((key) => {
        const audio = new Audio(SOUND_FILES[key]);
        audio.volume = 0.75;
        audio.preload = 'auto';
        this.audioCache.set(key, audio);
      });
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (typeof window !== 'undefined') {
      localStorage.setItem('vb_sound_enabled', String(val));
    }
  }

  public play(type: SoundType) {
    if (!this.enabled || typeof window === 'undefined') return;

    if (type === 'wrong') {
      this.playSynthWrong();
      return;
    }

    const cached = this.audioCache.get(type);
    if (cached) {
      cached.currentTime = 0;
      cached.play().catch(() => {
        this.playSynthFallback(type);
      });
    } else {
      const audio = new Audio(SOUND_FILES[type]);
      audio.volume = 0.75;
      this.audioCache.set(type, audio);
      audio.play().catch(() => {
        this.playSynthFallback(type);
      });
    }
  }

  private playSynthWrong() {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(190, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(130, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // ignore
    }
  }

  private playSynthFallback(type: SoundType) {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      if (type === 'correct') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);
      } else if (type === 'notice') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(587.33, ctx.currentTime + 0.1);
      } else {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.15);
      }
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // ignore
    }
  }

  /**
   * Speaks or plays audio for an English vocabulary word.
   * Uses HTMLAudioElement first if URL works, and falls back to Web Speech API (en-US).
   */
  public speakWord(word: string, audioUrl?: string) {
    if (!this.enabled || typeof window === 'undefined' || !word) return;

    const fallbackWebSpeech = () => {
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(word);
          utter.lang = 'en-US';
          utter.rate = 0.92;
          const voices = window.speechSynthesis.getVoices();
          const usVoice =
            voices.find((v) => v.lang === 'en-US' && v.name.includes('Google')) ||
            voices.find((v) => v.lang.startsWith('en-US')) ||
            voices.find((v) => v.lang.startsWith('en'));
          if (usVoice) utter.voice = usVoice;
          window.speechSynthesis.speak(utter);
        } catch {
          // ignore
        }
      }
    };

    if (audioUrl) {
      if (!this.wordAudioElement) {
        this.wordAudioElement = new Audio();
      }
      const el = this.wordAudioElement;
      el.pause();
      el.src = audioUrl;
      el.volume = 0.9;
      el.onerror = () => {
        fallbackWebSpeech();
      };
      el.play().catch(() => {
        fallbackWebSpeech();
      });
    } else {
      fallbackWebSpeech();
    }
  }
}

export const soundManager = new SoundManager();
