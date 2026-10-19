import React from 'react';
import { DECK_LIST } from '../data/vocabDecks';
import { PlayerInfo, RoomConfig } from '../types/game';
import { Locale, TRANSLATIONS } from '../i18n/translations';

interface VocabBattleGameStartProps {
  locale: Locale;
  currentUser: { userId: string; displayName: string; avatar: string };
  opponent: PlayerInfo;
  roomConfig: RoomConfig;
  totalRounds: number;
}

export const VocabBattleGameStart: React.FC<VocabBattleGameStartProps> = ({
  locale,
  currentUser,
  opponent,
  roomConfig,
  totalRounds,
}) => {
  const t = TRANSLATIONS[locale];
  const deckMeta =
    DECK_LIST.find((d) => d.id === roomConfig.deckId) || DECK_LIST[0];

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full max-w-2xl mx-auto py-12 animate-in fade-in duration-300">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-extrabold uppercase tracking-wider">
        <span>{locale === 'vi' ? deckMeta.nameVi : deckMeta.nameEn}</span>
      </div>

      <div className="flex items-center justify-center gap-6 sm:gap-12 w-full">
        {/* You */}
        <div className="flex flex-col items-center gap-3 flex-1">
          <div className="h-20 w-20 rounded-full border-4 border-purple-500 bg-purple-500/10 flex items-center justify-center text-4xl shadow-lg">
            {currentUser.avatar}
          </div>
          <span className="text-base font-extrabold text-center max-w-[140px] truncate">
            {currentUser.displayName}
          </span>
        </div>

        {/* VS */}
        <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse">
          {t.gameStart.vs}
        </div>

        {/* Opponent */}
        <div className="flex flex-col items-center gap-3 flex-1">
          <div className="h-20 w-20 rounded-full border-4 border-pink-500 bg-pink-500/10 flex items-center justify-center text-4xl shadow-lg">
            {opponent.avatar}
          </div>
          <span className="text-base font-extrabold text-center max-w-[140px] truncate">
            {opponent.displayName}
          </span>
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm font-bold text-foreground">
          {t.gameStart.rounds
            .replace('{{count}}', String(totalRounds))
            .replace('{{sec}}', String(roomConfig.roundTimeSec))}
        </p>
        <p className="text-xs text-muted-foreground animate-pulse">
          {t.gameStart.getReady}
        </p>
      </div>
    </div>
  );
};
