import React, { useState } from 'react';
import {
  Check,
  Clock,
  Copy,
  Layers,
  Link2,
  Loader2,
  Play,
  Sparkles,
  Swords,
  Trophy,
  Wifi,
  X,
} from 'lucide-react';
import { DECK_LIST } from '../data/vocabDecks';
import { PlayerInfo, RoomConfig } from '../types/game';
import { Locale, TRANSLATIONS } from '../i18n/translations';

interface VocabBattleWaitingRoomProps {
  locale: Locale;
  roomId: string;
  isHost: boolean;
  players: PlayerInfo[];
  roomConfig: RoomConfig;
  isConnectedP2P: boolean;
  pingMs: number | null;
  onUpdateConfig: (partial: Partial<RoomConfig>) => void;
  onStartMatch: () => void;
  onLeaveRoom: () => void;
}

const ROUND_OPTIONS = [5, 10, 15, 20, 30];
const TIME_OPTIONS = [15, 20, 30, 45, 60];

export const VocabBattleWaitingRoom: React.FC<VocabBattleWaitingRoomProps> = ({
  locale,
  roomId,
  isHost,
  players,
  roomConfig,
  isConnectedP2P,
  pingMs,
  onUpdateConfig,
  onStartMatch,
  onLeaveRoom,
}) => {
  const t = TRANSLATIONS[locale];
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?room=${roomId}`
      : `?room=${roomId}`;

  const hostPlayer = players.find((p) => p.isHost) || players[0];
  const guestPlayer = players.find((p) => !p.isHost) || players[1];
  const canStart = players.length >= 2;

  const selectedDeckMeta =
    DECK_LIST.find((d) => d.id === roomConfig.deckId) || DECK_LIST[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Main Waiting Card */}
      <div className="duo-card p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-duo bg-purple-600/10 border-2 border-purple-600/30 flex items-center justify-center">
              <Swords className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg">
                {t.waitingRoom.title}
              </h2>
              <p className="text-xs text-muted-foreground">
                {canStart
                  ? t.waitingRoom.opponentJoined
                  : t.waitingRoom.waitingOpponent}
              </p>
            </div>
          </div>

          {canStart && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <Wifi className="h-3.5 w-3.5 animate-pulse" />
              <span>
                P2P Trực Tiếp {pingMs !== null ? `(${pingMs}ms)` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Players VS Display */}
        <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 items-center rounded-duo-lg border-2 border-purple-200 dark:border-purple-900/60 bg-gradient-to-r from-purple-50/70 via-background to-pink-50/70 dark:from-purple-950/30 dark:via-background dark:to-pink-950/30 p-5">
          {/* Host Slot */}
          <div className="sm:col-span-5 flex flex-col items-center gap-2 text-center">
            <div className="h-16 w-16 rounded-full border-3 border-purple-500 bg-purple-500/10 flex items-center justify-center text-3xl shadow-duo-sm">
              {hostPlayer?.avatar || '🦜'}
            </div>
            <div>
              <p className="font-extrabold text-base">
                {hostPlayer?.displayName || 'Host'}
              </p>
              <span className="inline-block text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-purple-600 text-white mt-0.5">
                {t.waitingRoom.hostBadge}
              </span>
            </div>
          </div>

          {/* VS Center */}
          <div className="sm:col-span-1 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse">
              VS
            </span>
          </div>

          {/* Guest Slot */}
          <div className="sm:col-span-5 flex flex-col items-center gap-2 text-center">
            {guestPlayer ? (
              <>
                <div className="h-16 w-16 rounded-full border-3 border-pink-500 bg-pink-500/10 flex items-center justify-center text-3xl shadow-duo-sm animate-in fade-in duration-300">
                  {guestPlayer.avatar}
                </div>
                <div>
                  <p className="font-extrabold text-base">
                    {guestPlayer.displayName}
                  </p>
                  <span className="inline-block text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-600 text-white mt-0.5">
                    Sẵn sàng
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="h-16 w-16 rounded-full border-2 border-dashed border-muted-foreground/40 bg-muted/40 flex items-center justify-center">
                  <Loader2 className="h-7 w-7 animate-spin text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">
                    {t.waitingRoom.waitingOpponent}
                  </p>
                  <span className="text-[11px] text-muted-foreground">
                    Gửi mã phòng hoặc link bên dưới cho bạn bè
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Share Room Code & Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Room Code Box */}
          <div className="rounded-duo border-2 border-border bg-muted/30 p-3.5 space-y-1.5">
            <p className="text-xs font-bold uppercase text-muted-foreground">
              {t.waitingRoom.roomCode}
            </p>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono font-black text-2xl tracking-widest text-purple-600 dark:text-purple-400">
                {roomId}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="duo-btn-outline px-3 py-1.5 text-xs shrink-0"
              >
                {codeCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{t.waitingRoom.codeCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>{t.waitingRoom.copyCode}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Share Link Box */}
          <div className="rounded-duo border-2 border-border bg-muted/30 p-3.5 space-y-1.5">
            <p className="text-xs font-bold uppercase text-muted-foreground">
              {t.waitingRoom.shareLink}
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-background border border-border px-2.5 py-1.5 text-xs font-mono truncate">
                {shareUrl}
              </code>
              <button
                type="button"
                onClick={handleCopyLink}
                className="duo-btn-outline px-3 py-1.5 text-xs shrink-0"
              >
                {linkCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{t.waitingRoom.linkCopied}</span>
                  </>
                ) : (
                  <>
                    <Link2 className="h-3.5 w-3.5" />
                    <span>{t.waitingRoom.copyLink}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Match Settings inside Waiting Room */}
        <div className="rounded-duo border-2 border-border p-4 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t.waitingRoom.settingsSummary}
          </p>

          {isHost ? (
            <div className="space-y-4">
              {/* Host Deck Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DECK_LIST.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => onUpdateConfig({ deckId: d.id })}
                    className={`px-3 py-2 rounded-xl border-2 text-xs font-bold text-left truncate transition-all ${
                      roomConfig.deckId === d.id
                        ? 'border-purple-600 bg-purple-500/15 text-purple-700 dark:text-purple-300'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    {locale === 'vi' ? d.nameVi : d.nameEn}
                  </button>
                ))}
              </div>

              {/* Host Rounds & Timer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground shrink-0">
                    Số vòng:
                  </span>
                  <div className="flex gap-1 flex-1">
                    {ROUND_OPTIONS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => onUpdateConfig({ totalRounds: r })}
                        className={`flex-1 h-8 rounded-lg border text-xs font-bold ${
                          roomConfig.totalRounds === r
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'border-border hover:bg-muted'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground shrink-0">
                    Thời gian:
                  </span>
                  <div className="flex gap-1 flex-1">
                    {TIME_OPTIONS.map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => onUpdateConfig({ roundTimeSec: sec })}
                        className={`flex-1 h-8 rounded-lg border text-xs font-bold ${
                          roomConfig.roundTimeSec === sec
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'border-border hover:bg-muted'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold">
                <Layers className="h-3.5 w-3.5" />
                {locale === 'vi'
                  ? selectedDeckMeta.nameVi
                  : selectedDeckMeta.nameEn}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold">
                <Trophy className="h-3.5 w-3.5" />
                {roomConfig.totalRounds} vòng
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-bold">
                <Clock className="h-3.5 w-3.5" />
                {roomConfig.roundTimeSec}s / vòng
              </span>
              {roomConfig.progressiveHints && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  <Sparkles className="h-3.5 w-3.5" />
                  Có gợi ý dần
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          {isHost ? (
            <button
              type="button"
              onClick={onStartMatch}
              disabled={!canStart}
              className="duo-btn-purple flex-1 h-12 py-3 text-base"
            >
              <Play className="h-5 w-5 fill-current" />
              <span>
                {canStart
                  ? t.waitingRoom.startGameBtn
                  : t.waitingRoom.waitingOpponent}
              </span>
            </button>
          ) : (
            <div className="flex-1 h-12 rounded-duo border-2 border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 flex items-center justify-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t.waitingRoom.waitingHostStart}</span>
            </div>
          )}

          <button
            type="button"
            onClick={onLeaveRoom}
            className="duo-btn-danger px-6 h-12 text-sm"
          >
            <X className="h-4 w-4" />
            <span>{t.waitingRoom.leaveRoomBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
