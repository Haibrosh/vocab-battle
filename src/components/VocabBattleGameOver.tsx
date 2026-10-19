import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Bookmark,
  Check,
  Frown,
  Handshake,
  Loader2,
  LogOut,
  RotateCcw,
  Settings2,
  Trophy,
  Volume2,
} from 'lucide-react';
import {
  GameOverData,
  PlayerInfo,
  RematchState,
  SavedVocabItem,
  VocabCard,
} from '../types/game';
import { Locale, TRANSLATIONS } from '../i18n/translations';
import { soundManager } from '../utils/sound';

interface VocabBattleGameOverProps {
  locale: Locale;
  userId: string;
  currentUser: { userId: string; displayName: string; avatar: string };
  opponent: PlayerInfo;
  gameOverData: GameOverData;
  rematchState: RematchState;
  onRematch: () => void;
  onBackToRoom: () => void;
  onLeaveRoom: () => void;
  savedNotebook: SavedVocabItem[];
  onSaveCard: (card: VocabCard) => void;
}

export const VocabBattleGameOver: React.FC<VocabBattleGameOverProps> = ({
  locale,
  userId,
  currentUser,
  opponent,
  gameOverData,
  rematchState,
  onRematch,
  onBackToRoom,
  onLeaveRoom,
  savedNotebook,
  onSaveCard,
}) => {
  const t = TRANSLATIONS[locale];
  const isWin = gameOverData.winnerId === userId;
  const isLose = gameOverData.loserId === userId;
  const isDraw = gameOverData.winnerId === null;

  const myPlayer = gameOverData.players.find((p) => p.userId === userId);
  const oppPlayer = gameOverData.players.find((p) => p.userId !== userId);

  useEffect(() => {
    if (isWin) {
      try {
        confetti({
          particleCount: 85,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  }, [isWin]);

  const getReasonText = () => {
    if (gameOverData.reason === 'player_quit') {
      return gameOverData.quitterId === userId
        ? t.gameOver.reason.player_quit.self
        : t.gameOver.reason.player_quit.opponent;
    }
    if (gameOverData.reason === 'player_disconnected') {
      return gameOverData.quitterId === userId
        ? t.gameOver.reason.player_disconnected.self
        : t.gameOver.reason.player_disconnected.opponent;
    }
    return t.gameOver.reason.all_rounds_done;
  };

  const isCardSaved = (cardId: string) =>
    savedNotebook.some((i) => i.card.cardId === cardId);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto py-6 animate-in fade-in duration-300">
      {/* Outcome Header */}
      <div className="text-center space-y-2">
        {isWin && (
          <>
            <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 border-4 border-green-400 flex items-center justify-center mx-auto shadow-lg">
              <Trophy className="h-10 w-10 text-green-600 animate-bounce" />
            </div>
            <h2 className="text-3xl font-black text-green-600">
              {t.gameOver.win}
            </h2>
          </>
        )}
        {isLose && (
          <>
            <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 border-4 border-red-400 flex items-center justify-center mx-auto shadow-lg">
              <Frown className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-red-500">
              {t.gameOver.lose}
            </h2>
          </>
        )}
        {isDraw && (
          <>
            <div className="h-20 w-20 rounded-full bg-yellow-100 dark:bg-yellow-900/30 border-4 border-yellow-400 flex items-center justify-center mx-auto shadow-lg">
              <Handshake className="h-10 w-10 text-yellow-600" />
            </div>
            <h2 className="text-3xl font-black text-yellow-600">
              {t.gameOver.draw}
            </h2>
          </>
        )}
        <p className="text-sm text-muted-foreground font-medium">
          {getReasonText()}
        </p>
      </div>

      {/* Players Score Comparison */}
      <div className="duo-card w-full p-6 flex items-center justify-around gap-4">
        {/* You */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="h-16 w-16 rounded-full border-3 border-purple-500 bg-purple-500/10 flex items-center justify-center text-3xl">
            {currentUser.avatar}
          </div>
          <span className="text-sm font-extrabold truncate max-w-[130px]">
            {currentUser.displayName}
          </span>
          <span className="px-4 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-base font-black">
            {t.gameOver.score.replace('{{score}}', String(myPlayer?.score ?? 0))}
          </span>
        </div>

        <div className="text-2xl font-black text-muted-foreground">VS</div>

        {/* Opponent */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="h-16 w-16 rounded-full border-3 border-pink-500 bg-pink-500/10 flex items-center justify-center text-3xl">
            {opponent.avatar}
          </div>
          <span className="text-sm font-extrabold truncate max-w-[130px]">
            {opponent.displayName}
          </span>
          <span className="px-4 py-1 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 text-base font-black">
            {t.gameOver.score.replace(
              '{{score}}',
              String(oppPlayer?.score ?? 0)
            )}
          </span>
        </div>
      </div>

      {/* Rematch & Navigation Actions */}
      <div className="flex flex-col gap-3 w-full">
        {rematchState === 'opponent_ready' && (
          <div className="rounded-duo border-2 border-emerald-500 bg-emerald-500/10 px-4 py-2.5 text-center text-sm font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
            {t.gameOver.rematchOpponentReady}
          </div>
        )}

        {gameOverData.canRematch && (
          <button
            type="button"
            onClick={onRematch}
            disabled={rematchState === 'waiting'}
            className={`duo-btn w-full h-12 text-base text-white shadow-lg ${
              rematchState === 'opponent_ready'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-b-4 border-emerald-800'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-b-4 border-purple-900'
            }`}
          >
            {rematchState === 'waiting' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{t.gameOver.rematchWaiting}</span>
              </>
            ) : (
              <>
                <RotateCcw className="h-5 w-5" />
                <span>{t.gameOver.rematch}</span>
              </>
            )}
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onBackToRoom}
            className="duo-btn-outline h-11 text-sm"
          >
            <Settings2 className="h-4 w-4 text-purple-600" />
            <span>{t.gameOver.backToRoom}</span>
          </button>

          <button
            type="button"
            onClick={onLeaveRoom}
            className="duo-btn-outline h-11 text-sm text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            <span>{t.gameOver.leaveRoom}</span>
          </button>
        </div>
      </div>

      {/* Match Vocabulary Review List */}
      {gameOverData.history && gameOverData.history.length > 0 && (
        <div className="duo-card w-full p-5 space-y-3 mt-2">
          <h3 className="font-extrabold text-base">
            {t.gameOver.matchWordsReview} ({gameOverData.history.length})
          </h3>
          <div className="divide-y divide-border">
            {gameOverData.history.map((item) => {
              const saved = isCardSaved(item.card.cardId);
              const wonByMe = item.winnerId === userId;
              const wonByOpp =
                item.winnerId !== null && item.winnerId !== userId;

              return (
                <div
                  key={`${item.round}-${item.card.cardId}`}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-muted-foreground">
                        #{item.round}
                      </span>
                      <span className="font-extrabold text-base text-primary">
                        {item.card.word}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {item.card.type}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          soundManager.speakWord(
                            item.card.word,
                            item.card.phonetics[0]?.audio
                          )
                        }
                        className="p-1 rounded hover:bg-muted text-pink-600"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                      {wonByMe && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          Bạn thắng{' '}
                          {item.timeTakenMs
                            ? `(${(item.timeTakenMs / 1000).toFixed(1)}s)`
                            : ''}
                        </span>
                      )}
                      {wonByOpp && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400">
                          {opponent.displayName} thắng{' '}
                          {item.timeTakenMs
                            ? `(${(item.timeTakenMs / 1000).toFixed(1)}s)`
                            : ''}
                        </span>
                      )}
                      {!wonByMe && !wonByOpp && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                          Hết giờ
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {item.card.translation.vi}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSaveCard(item.card)}
                    disabled={saved}
                    className={`px-3 py-1.5 rounded-duo text-xs font-bold flex items-center gap-1 shrink-0 ${
                      saved
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                        : 'duo-btn-outline'
                    }`}
                  >
                    {saved ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Đã lưu
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-3.5 w-3.5" />
                        Lưu
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
