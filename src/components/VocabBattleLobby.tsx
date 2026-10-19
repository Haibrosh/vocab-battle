import React, { useEffect, useState } from 'react';
import {
  Bot,
  CircleX,
  Clock,
  Download,
  FilePlus2,
  Flame,
  Globe,
  Handshake,
  Layers,
  Loader2,
  LogIn,
  Search,
  Sparkles,
  Swords,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import {
  DECK_LIST,
  getDeckCardCount,
  parseCustomVocabulary,
  TOTAL_PARROTO_CARDS,
} from '../data/vocabDecks';
import { DeckId, PlayerStats, RoomConfig, VocabCard } from '../types/game';
import { Locale, TRANSLATIONS } from '../i18n/translations';
import {
  fetchParrotoDeckCards,
  ParrotoCommunityDeck,
  searchParrotoCommunityDecks,
} from '../utils/parrotoApi';

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

type DeckFilterCategory = 'all' | 'core' | 'oxford' | 'ielts' | 'exam';

const CATEGORY_MAP: Record<Exclude<DeckFilterCategory, 'all'>, DeckId[]> = {
  core: ['all', 'common-1000', 'conversation', 'lunar-new-year', 'custom'],
  oxford: [
    'oxford-3000-a1',
    'oxford-3000-a2',
    'oxford-b1-b2',
    'oxford-c1-c2',
  ],
  ielts: ['ielts-600', 'ielts-band-4-5', 'ielts-advanced', 'toefl-essential'],
  exam: ['toeic-600', 'ets-toeic', 'thpt-qg', 'sat-c1-c2'],
};

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
  const [deckCategory, setDeckCategory] = useState<DeckFilterCategory>('all');
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'community' | 'manual'>('community');
  const [draftCustomText, setDraftCustomText] = useState(rawCustomText);

  // Parroto Community Deck Browser State
  const [commSearch, setCommSearch] = useState('');
  const [commDecks, setCommDecks] = useState<ParrotoCommunityDeck[]>([]);
  const [commTotal, setCommTotal] = useState<number>(3593);
  const [commLoading, setCommLoading] = useState(false);
  const [importingDeckId, setImportingDeckId] = useState<string | null>(null);
  const [importedDeckName, setImportedDeckName] = useState<string | null>(null);

  const loadCommunityDecks = async (q: string) => {
    setCommLoading(true);
    try {
      const res = await searchParrotoCommunityDecks(q, 1, 24);
      setCommDecks(res.decks);
      setCommTotal(res.total);
    } catch {
      // Ignore network errors silently
    } finally {
      setCommLoading(false);
    }
  };

  useEffect(() => {
    if (customModalOpen && modalTab === 'community' && commDecks.length === 0) {
      void loadCommunityDecks('');
    }
  }, [customModalOpen, modalTab, commDecks.length]);

  const handleImportCommunityDeck = async (deck: ParrotoCommunityDeck) => {
    setImportingDeckId(deck._id);
    try {
      const cards = await fetchParrotoDeckCards(deck._id);
      if (cards.length > 0) {
        const serialized = cards
          .map(
            (c) =>
              `${c.word} | ${c.translation.vi} | ${c.explanation.vi} | ${c.exampleMasked.en}`
          )
          .join('\n');
        onSaveCustomText(serialized, cards);
        setDraftCustomText(serialized);
        setImportedDeckName(`${deck.name} (${cards.length} từ)`);
        onUpdateConfig({ deckId: 'custom' });
        setCustomModalOpen(false);
      }
    } catch {
      // Ignore error
    } finally {
      setImportingDeckId(null);
    }
  };

  const filteredDecks =
    deckCategory === 'all'
      ? DECK_LIST
      : DECK_LIST.filter((d) => CATEGORY_MAP[deckCategory].includes(d.id));

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
                    Kho <b className="text-purple-600">{TOTAL_PARROTO_CARDS.toLocaleString()}</b> từ vựng Parroto chính gốc + 3,500+ bộ từ cộng đồng
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDraftCustomText(rawCustomText);
                  setCustomModalOpen(true);
                }}
                className="duo-btn-outline px-3 py-1.5 text-xs border-purple-400/60 hover:bg-purple-500/10"
              >
                <Globe className="h-3.5 w-3.5 text-purple-600" />
                <span>
                  Kho Cộng Đồng & Tự Nhập ({customCards.length.toLocaleString()})
                </span>
              </button>
            </div>

            {/* 1. Deck Selection (17 Decks, 15,397+ words) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  <Layers className="h-4 w-4 text-purple-600" />
                  <span>
                    {t.lobby.deckLabel} ({DECK_LIST.length} bộ ·{' '}
                    {TOTAL_PARROTO_CARDS.toLocaleString()} từ)
                  </span>
                </label>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: 'all', label: 'Tất cả (17)' },
                    { id: 'core', label: 'Thông dụng' },
                    { id: 'oxford', label: 'Oxford 3000/5000' },
                    { id: 'ielts', label: 'IELTS & TOEFL' },
                    { id: 'exam', label: 'TOEIC · THPT · SAT' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() =>
                        setDeckCategory(cat.id as DeckFilterCategory)
                      }
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                        deckCategory === cat.id
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                {filteredDecks.map((deck) => {
                  const selected = roomConfig.deckId === deck.id;
                  const count = getDeckCardCount(deck.id, customCards);
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
                        <span className="font-bold text-sm truncate flex items-center gap-1.5">
                          <span>{deck.icon}</span>
                          <span className="truncate">
                            {locale === 'vi' ? deck.nameVi : deck.nameEn}
                          </span>
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${deck.color} shrink-0`}
                        >
                          {deck.badge} · {count.toLocaleString()} từ
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {deck.id === 'custom' && importedDeckName
                          ? `Đang dùng: ${importedDeckName}`
                          : locale === 'vi'
                            ? deck.descVi
                            : deck.descEn}
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

      {/* Custom & Parroto Community Vocabulary Modal */}
      {customModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="duo-card w-full max-w-3xl rounded-duo-lg p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-extrabold text-base">
                <Globe className="h-5 w-5 text-purple-600" />
                <span>
                  Mở Rộng Kho Từ Vựng (Cộng Đồng Parroto & Tự Nhập)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCustomModalOpen(false)}
                className="p-1 rounded-lg hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex gap-2 border-b border-border pb-3">
              <button
                type="button"
                onClick={() => setModalTab('community')}
                className={`px-4 py-2 rounded-duo text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                  modalTab === 'community'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                <span>
                  Kho {commTotal.toLocaleString()}+ Bộ Từ Cộng Đồng Parroto
                </span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab('manual')}
                className={`px-4 py-2 rounded-duo text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                  modalTab === 'manual'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <FilePlus2 className="h-3.5 w-3.5" />
                <span>Tự Nhập Danh Sách Từ ({customCards.length})</span>
              </button>
            </div>

            {modalTab === 'community' ? (
              <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-hidden">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void loadCommunityDecks(commSearch);
                  }}
                  className="flex gap-2"
                >
                  <div className="relative flex-1">
                    <Search className="h-4 w-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={commSearch}
                      onChange={(e) => setCommSearch(e.target.value)}
                      placeholder="Tìm kiếm trong 3,593+ bộ từ Parroto (VD: IELTS, TOEIC, B2, C1, Cam 18, THPT, IT, Y khoa...)"
                      className="w-full h-10 pl-9 pr-3 rounded-duo border-2 border-border bg-muted/40 text-xs font-semibold focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={commLoading}
                    className="duo-btn-purple px-4 h-10 text-xs shrink-0"
                  >
                    {commLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Search className="h-3.5 w-3.5" />
                    )}
                    <span>Tìm kiếm</span>
                  </button>
                </form>

                {/* Quick search tags */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'IELTS',
                    'TOEIC',
                    'Oxford',
                    'B2',
                    'C1',
                    'THPT',
                    'SAT',
                    'Business',
                    'Phrasal verb',
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setCommSearch(tag);
                        void loadCommunityDecks(tag);
                      }}
                      className="px-2.5 py-1 rounded-full bg-muted hover:bg-purple-500/15 hover:text-purple-600 text-[11px] font-bold transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                {/* Deck results list */}
                <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5 pr-1 min-h-[260px]">
                  {commLoading ? (
                    <div className="col-span-2 flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
                      <Loader2 className="h-7 w-7 animate-spin text-purple-600" />
                      <span className="text-xs font-semibold">
                        Đang tải danh sách bộ từ từ Parroto...
                      </span>
                    </div>
                  ) : commDecks.length === 0 ? (
                    <div className="col-span-2 flex flex-col items-center justify-center py-12 text-xs text-muted-foreground">
                      Không tìm thấy bộ từ nào phù hợp. Hãy thử từ khóa khác!
                    </div>
                  ) : (
                    commDecks.map((d) => {
                      const isImporting = importingDeckId === d._id;
                      return (
                        <div
                          key={d._id}
                          className="rounded-duo border-2 border-border p-3 flex items-center justify-between gap-3 hover:border-purple-500/40 bg-card"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-xs sm:text-sm truncate">
                              {d.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              <b className="text-purple-600">
                                {d.total_cards} từ
                              </b>{' '}
                              · {d.total_groups} nhóm · {d.study_count || 0}{' '}
                              lượt học
                            </p>
                          </div>
                          <button
                            type="button"
                            disabled={!!importingDeckId}
                            onClick={() => handleImportCommunityDeck(d)}
                            className="duo-btn-purple px-3 py-1.5 text-xs shrink-0"
                          >
                            {isImporting ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Download className="h-3.5 w-3.5" />
                            )}
                            <span>{isImporting ? 'Đang tải...' : 'Nạp'}</span>
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Mỗi dòng nhập 1 từ theo định dạng:{' '}
                  <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">
                    từ_tiếng_Anh | nghĩa_tiếng_Việt | giải_thích | câu_ví_dụ
                  </code>{' '}
                  (2 cột cuối không bắt buộc). Khi bạn tạo phòng với bộ từ này,
                  bạn bè vào phòng sẽ tự động đồng bộ danh sách từ của bạn!
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
