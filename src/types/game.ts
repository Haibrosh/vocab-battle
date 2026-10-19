export type DeckId =
  | 'all'
  | 'ielts'
  | 'toeic'
  | 'oxford3000'
  | 'communication'
  | 'advanced'
  | 'custom';

export interface PhoneticItem {
  locale: 'en-US' | 'en-GB';
  text: string;
  audio?: string;
}

export interface VocabCard {
  cardId: string;
  word: string;
  type: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrasal verb' | 'idiom';
  deckId: Exclude<DeckId, 'all'>;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  phonetics: PhoneticItem[];
  translation: {
    vi: string;
    en: string;
  };
  explanation: {
    vi: string;
    en: string;
  };
  exampleMasked: {
    en: string;
    vi: string;
  };
}

export interface PublicRoundCard {
  cardId: string;
  type: VocabCard['type'];
  level: VocabCard['level'];
  deckId: VocabCard['deckId'];
  wordMask: string;
  translation: {
    vi: string;
    en: string;
  };
  explanation: {
    vi: string;
    en: string;
  };
  exampleMasked: {
    en: string;
    vi: string;
  };
}

export interface RoomConfig {
  deckId: DeckId;
  totalRounds: number;
  roundTimeSec: number;
  progressiveHints: boolean;
  isPublic: boolean;
  password?: string;
}

export interface PlayerInfo {
  userId: string;
  displayName: string;
  avatar: string;
  score: number;
  isHost: boolean;
  isBot?: boolean;
}

export interface AnswerBubble {
  id: number;
  answer: string;
  correct: boolean;
  isOpponent: boolean;
  playerName: string;
}

export interface MatchRoundSummary {
  round: number;
  card: VocabCard;
  winnerId: string | null;
  timeTakenMs?: number;
}

export interface GameOverData {
  winnerId: string | null;
  loserId: string | null;
  reason: 'all_rounds_done' | 'player_quit' | 'player_disconnected';
  quitterId?: string;
  players: PlayerInfo[];
  history: MatchRoundSummary[];
  canRematch: boolean;
}

export type GameState =
  | 'idle'
  | 'room-waiting'
  | 'game-start'
  | 'playing'
  | 'round-result'
  | 'game-over';

export type RematchState = 'idle' | 'waiting' | 'opponent_ready';

export interface PlayerStats {
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  totalDraws: number;
  totalRoundsWon: number;
}

export interface SavedVocabItem {
  card: VocabCard;
  savedAt: string;
}

export type P2PMessage =
  | { type: 'JOIN_REQUEST'; player: PlayerInfo; password?: string }
  | { type: 'JOIN_REJECTED'; reason: string }
  | {
      type: 'ROOM_SYNC';
      roomId: string;
      config: RoomConfig;
      players: PlayerInfo[];
      customCards?: VocabCard[];
    }
  | {
      type: 'GAME_START';
      config: RoomConfig;
      players: PlayerInfo[];
      totalRounds: number;
    }
  | {
      type: 'ROUND_START';
      round: number;
      totalRounds: number;
      timeMs: number;
      card: PublicRoundCard;
      players: PlayerInfo[];
    }
  | {
      type: 'ROUND_HINT';
      wordMask?: string;
      phonetics?: PhoneticItem[];
    }
  | {
      type: 'SUBMIT_ANSWER';
      answer: string;
      playerId: string;
      playerName: string;
      timestamp: number;
    }
  | {
      type: 'OPPONENT_ANSWER';
      answer: string;
      correct: boolean;
      playerId: string;
      playerName: string;
    }
  | {
      type: 'WRONG_ANSWER';
      answer: string;
    }
  | {
      type: 'ROUND_RESULT';
      winnerId: string | null;
      word: string;
      players: PlayerInfo[];
      isTimeout: boolean;
      card: VocabCard;
    }
  | {
      type: 'GAME_OVER';
      data: GameOverData;
    }
  | { type: 'REMATCH_REQUEST'; playerId: string }
  | { type: 'BACK_TO_ROOM'; config: RoomConfig; players: PlayerInfo[] }
  | { type: 'QUIT_MATCH'; playerId: string }
  | { type: 'PING'; t: number }
  | { type: 'PONG'; t: number };
