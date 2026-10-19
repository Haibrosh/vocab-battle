import React, { useState } from 'react';
import {
  Bot,
  CircleX,
  Clock,
  FilePlus2,
  Flame,
  Handshake,
  Layers,
  Loader2,
  LogIn,
  Sparkles,
  Swords,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import {
  BUILTIN_VOCAB_CARDS,
  DECK_LIST,
  parseCustomVocabulary,
} from '../data/vocabDecks';
import { DeckId, PlayerStats, RoomConfig, VocabCard } from '../types/game';
import { Locale, TRANSLATIONS } from '../i18n/translations';

interface VocabBattleLobbyProps {
  locale: Locale;
  currentUser: { userId: string; displayName: string; avatar: string };
  stats: PlayerStats;
  roomConfig: RoomConfig;
  onUpdateConfig: (partial: Partial<RoomConfig>) => void;
  onCreateRoom: (config?: Partial<RoomConfig>) => void;
  onJoinRoom: (code: string, password?: string) => void;
  onStartBotMatch: (config?: Partial<RoomConfig>) => void;
  isConnecting: boolean;
  customCards: VocabCard[];
  rawCustomText: string;
  onSaveCustomText: (raw: string, parsed: VocabCard[]) => void;
}

const ROUND_OPTIONS = [5, 10, 15, 20, 30];
const TIME_OPTIONS = [15, 20, 30, 45, 60];

export const VocabBattleLobby: React.FC<VocabBattleLobbyProps> = ({
  locale,
  currentUser,
  stats,
  roomConfig,
  onUpdateConfig,
  onCreateRoom,
  onJoinRoom,
  onStartBotMatch,
  isConnecting,
  customCards,
  rawCustomText,
  onSaveCustomText,
}) => {
  const t = TRANSLATIONS[locale];
  const [joinCode, setJoinCode] = useState('');
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [draftCustomText, setDraftCustomText] = useState(rawCustomText);

  const getDeckCardCount = (id: DeckId) => {
    if (id === 'all') return BUILTIN_VOCAB_CARDS.length + customCards.length;
    if (id === 'custom') return customCards.length;
    return BUILTIN_VOCAB_CARDS.filter((c) => c.deckId === id).length;
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim() || isConnecting) return;
    onJoinRoom(joinCode.trim().toUpperCase());
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Join Room + Player Stats + Practice Bot (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Join Friend's Room by Code */}
          <div className="duo-card p-5 space-y-4 border-purple-300 dark:border-purple-800">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-duo bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="font-extrabold text-base">
                  {t.lobby.joinRoomTitle}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Nhập mã phòng 6 ký tự từ bạn bè để vào thẳng phòng đấu
                </p>
              </div>
            </div>

            <form onSubmit={handleJoinSubmit} className="flex gap-2">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder={t.lobby.enterCodePlaceholder}
                maxLength={10}
                className="flex-1 h-12 px-4 rounded-duo border-2 border-border bg-muted/50 focus:border-purple-600 focus:outline-none font-mono font-bold text-base uppercase tracking-widest"
              />
              <button
                type="submit"
                disabled={!joinCode.trim() || isConnecting}
                className="duo-btn-purple px-5 h-12 text-sm shrink-0"
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
                <span>{isConnecting ? t.lobby.joining : t.lobby.joinBtn}</span>
              </button>
            </form>
          </div>

          {/* Player Stats Card (Parroto style, without diamonds/ELO) */}
          <div className="duo-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-duo-pill border-2 border-primary/30 bg-primary/10 flex items-center justify-center text-2xl shadow-duo-sm shrink-0">
                {currentUser.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-base truncate">
                  {currentUser.displayName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.lobby.statsTitle} · {stats.totalGames}{' '}
                  {locale === 'vi' ? 'trận đã đấu' : 'matches'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 divide-x divide-border pt-1">
              <div className="flex flex-col items-center gap-0.5 px-2">
                <div className="h-9 w-9 rounded-duo-pill border-2 border-border bg-green-100 dark:bg-green-900/30 flex items-center justify-center shadow-duo-sm">
                  <Trophy className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-xl font-black mt-1 tabular-nums">
                  {stats.totalWins}
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {t.lobby.wins}
                </span>
              </div>

              <div className="flex flex-col items-center gap-0.5 px-2">
                <div className="h-9 w-9 rounded-duo-pill border-2 border-border bg-red-100 dark:bg-red-900/30 flex items-center justify-center shadow-duo-sm">
                  <CircleX className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-xl font-black mt-1 tabular-nums">
                  {stats.totalLosses}
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {t.lobby.losses}
                </span>
              </div>

              <div className="flex flex-col items-center gap-0.5 px-2">
                <div className="h-9 w-9 rounded-duo-pill border-2 border-border bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shadow-duo-sm">
                  <Handshake className="h-4 w-4 text-yellow-600" />
                </div>
                <span className="text-xl font-black mt-1 tabular-nums">
                  {stats.totalDraws}
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {t.lobby.draws}
                </span>
              </div>

              <div className="flex flex-col items-center gap-0.5 px-2">
                <div className="h-9 w-9 rounded-duo-pill border-2 border-border bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shadow-duo-sm">
                  <Flame className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-xl font-black mt-1 text-blue-600 tabular-nums">
                  {stats.totalRoundsWon}
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {t.lobby.roundsWon}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Practice vs Bot */}
          <div className="duo-card p-5 space-y-3 bg-gradient-to-br from-card to-muted/40">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-duo bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center shrink-0">
                  <Bot className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    {t.lobby.practiceBotTitle}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {t.lobby.practiceBotDesc}
                  </p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onStartBotMatch(roomConfig)}
              className="duo-btn-outline w-full h-11 text-sm border-amber-400/60 hover:bg-amber-500/10"
            >
              <Bot className="h-4 w-4 text-amber-600" />
              <span>{t.lobby.practiceBotBtn}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Create Room & Customize Deck / Rules (7 cols) */}
        <div className="lg:col-span-7">
          <div className="duo-card p-5 sm:p-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="h-11 w-11 rounded-duo bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-md">
                  <Swords className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-extrabold text-lg">
                    {t.lobby.createRoomTitle}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Tuỳ chỉnh bộ từ vựng, số vòng và thời gian trước khi bắt đầu
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDraftCustomText(rawCustomText);
                  setCustomModalOpen(true);
                }}
                className="duo-btn-outline px-3 py-1.5 text-xs"
              >
                <FilePlus2 className="h-3.5 w-3.5 text-purple-600" />
                <span>
                  {t.lobby.customDeckBtn} ({customCards.length})
                </span>
              </button>
            </div>

            {/* 1. Deck Selection */}
            <div className="space-y-2.5">
              <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                <Layers className="h-4 w-4 text-purple-600" />
                <span>{t.lobby.deckLabel}</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DECK_LIST.map((deck) => {
                  const selected = roomConfig.deckId === deck.id;
                  const count = getDeckCardCount(deck.id);
                  return (
                    <button
                      key={deck.id}
                      type="button"
                      onClick={() => {
                        onUpdateConfig({ deckId: deck.id });
                        if (deck.id === 'custom' && customCards.length === 0) {
                          setDraftCustomText(rawCustomText);
                          setCustomModalOpen(true);
                        }
                      }}
                      className={`rounded-duo border-2 p-3 text-left transition-all flex flex-col justify-between gap-1.5 ${
                        selected
                          ? 'border-purple-600 bg-purple-500/10 shadow-duo-sm'
                          : 'border-border hover:border-primary/40 hover:bg-muted/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 w-full">
                        <span className="font-bold text-sm truncate">
                          {locale === 'vi' ? deck.nameVi : deck.nameEn}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${deck.color} shrink-0`}
                        >
                          {deck.badge} · {count} từ
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {locale === 'vi' ? deck.descVi : deck.descEn}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Rounds & Time per Round */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Total Rounds */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span>{t.lobby.roundsLabel}</span>
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {ROUND_OPTIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => onUpdateConfig({ totalRounds: r })}
                      className={`h-10 rounded-duo border-2 font-bold text-sm transition-all ${
                        roomConfig.totalRounds === r
                          ? 'border-purple-600 bg-purple-600 text-white shadow-sm'
                          : 'border-border bg-card hover:bg-muted'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time per Round */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>{t.lobby.timeLabel}</span>
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {TIME_OPTIONS.map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => onUpdateConfig({ roundTimeSec: sec })}
                      className={`h-10 rounded-duo border-2 font-bold text-sm transition-all ${
                        roomConfig.roundTimeSec === sec
                          ? 'border-orange-500 bg-orange-500 text-white shadow-sm'
                          : 'border-border bg-card hover:bg-muted'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Progressive Hints Toggle */}
            <label className="flex items-center justify-between gap-3 rounded-duo border-2 border-border bg-muted/30 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-purple-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">
                  {t.lobby.hintsLabel}
                </span>
              </div>
              <input
                type="checkbox"
                checked={roomConfig.progressiveHints}
                onChange={(e) =>
                  onUpdateConfig({ progressiveHints: e.target.checked })
                }
                className="h-5 w-5 accent-purple-600 rounded cursor-pointer"
              />
            </label>

            {/* 4. Create Room Button */}
            <button
              type="button"
              onClick={() => onCreateRoom(roomConfig)}
              disabled={isConnecting}
              className="duo-btn-purple w-full h-13 py-3.5 text-base shadow-duo"
            >
              {isConnecting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Swords className="h-5 w-5" />
              )}
              <span>
                {isConnecting ? t.lobby.creatingRoom : t.lobby.createRoomBtn}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Vocabulary Modal */}
      {customModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="duo-card w-full max-w-2xl rounded-duo-lg p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-extrabold text-base">
                <FilePlus2 className="h-5 w-5 text-purple-600" />
                <span>Nhập Danh Sách Từ Vựng Riêng (Custom Deck)</span>
              </div>
              <button
                type="button"
                onClick={() => setCustomModalOpen(false)}
                className="p-1 rounded-lg hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Mỗi dòng nhập 1 từ theo định dạng:{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">
                từ_tiếng_Anh | nghĩa_tiếng_Việt | giải_thích | câu_ví_dụ
              </code>{' '}
              (2 cột cuối không bắt buộc). Khi bạn tạo phòng với bộ từ này, bạn
              bè vào phòng sẽ tự động đồng bộ danh sách từ của bạn!
            </p>

            <textarea
              value={draftCustomText}
              onChange={(e) => setDraftCustomText(e.target.value)}
              rows={9}
              placeholder={`resilient | kiên cường, phục hồi nhanh | Có khả năng bật dậy sau khó khăn | She is a very resilient athlete.\nnegotiate | đàm phán, thương lượng | Thảo luận để đạt thỏa thuận | We need to negotiate a better price.`}
              className="w-full rounded-duo border-2 border-border bg-muted/30 p-3.5 font-mono text-xs focus:border-purple-600 focus:outline-none flex-1"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Đã nhận diện:{' '}
                <b className="text-purple-600">
                  {parseCustomVocabulary(draftCustomText).length}
                </b>{' '}
                từ hợp lệ
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCustomModalOpen(false)}
                  className="duo-btn-outline px-4 py-2 text-xs"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const parsed = parseCustomVocabulary(draftCustomText);
                    onSaveCustomText(draftCustomText, parsed);
                    onUpdateConfig({ deckId: 'custom' });
                    setCustomModalOpen(false);
                  }}
                  className="duo-btn-purple px-5 py-2 text-xs"
                >
                  Lưu & Chọn Bộ Từ Này
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
