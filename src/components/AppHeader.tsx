import React, { useState } from 'react';
import {
  BookMarked,
  Check,
  Globe,
  Moon,
  Plus,
  Search,
  Sun,
  Trash2,
  User,
  Volume2,
  VolumeX,
  Wifi,
  X,
} from 'lucide-react';
import { ParrotoLogo } from './ParrotoLogo';
import { BUILTIN_VOCAB_CARDS } from '../data/vocabDecks';
import { SavedVocabItem, VocabCard } from '../types/game';
import { Locale, TRANSLATIONS } from '../i18n/translations';
import { soundManager } from '../utils/sound';

const AVATAR_PRESETS = [
  '🦜',
  '🦊',
  '🐼',
  '🐯',
  '🦁',
  '🐸',
  '🦉',
  '🦄',
  '🐲',
  '🚀',
  '⚡',
  '🔥',
];

interface AppHeaderProps {
  locale: Locale;
  onToggleLocale: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentUser: { userId: string; displayName: string; avatar: string };
  onUpdateUser: (name: string, avatar: string) => void;
  savedNotebook: SavedVocabItem[];
  onSaveCard: (card: VocabCard) => void;
  onRemoveSavedCard: (cardId: string) => void;
  isConnectedP2P: boolean;
  pingMs: number | null;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  locale,
  onToggleLocale,
  darkMode,
  onToggleDarkMode,
  soundEnabled,
  onToggleSound,
  currentUser,
  onUpdateUser,
  savedNotebook,
  onSaveCard,
  onRemoveSavedCard,
  isConnectedP2P,
  pingMs,
}) => {
  const t = TRANSLATIONS[locale];
  const [dictOpen, setDictOpen] = useState(false);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [editName, setEditName] = useState(currentUser.displayName);
  const [editAvatar, setEditAvatar] = useState(currentUser.avatar);

  const filteredCards =
    searchQuery.trim().length >= 1
      ? BUILTIN_VOCAB_CARDS.filter(
          (c) =>
            c.word.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
            c.translation.vi
              .toLowerCase()
              .includes(searchQuery.trim().toLowerCase())
        ).slice(0, 20)
      : [];

  const isCardSaved = (cardId: string) =>
    savedNotebook.some((item) => item.card.cardId === cardId);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center border-b-2 border-border bg-background/95 backdrop-blur-md px-4">
        <div className="container mx-auto flex items-center justify-between gap-2">
          {/* Brand + Dictionary Search */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
              }}
              className="flex items-center gap-2 group"
            >
              <ParrotoLogo size={36} />
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl text-primary tracking-tight leading-none">
                  Parroto
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Vocab Battle P2P
                </span>
              </div>
            </a>

            <button
              type="button"
              onClick={() => setDictOpen(true)}
              className="flex items-center gap-2 px-3 h-9 rounded-duo-pill border-2 border-border bg-muted hover:bg-muted/80 hover:border-primary/40 transition-all active:translate-y-[1px] text-muted-foreground"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold hidden md:inline">
                {t.header.dictionary}
              </span>
            </button>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {isConnectedP2P && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-duo-pill border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-duo-sm"
                title="Kết nối trực tiếp P2P WebRTC không độ trễ"
              >
                <Wifi className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                <span>{pingMs !== null ? `${pingMs}ms` : 'P2P'}</span>
              </div>
            )}

            {/* Saved Notebook Button */}
            <button
              type="button"
              onClick={() => setNotebookOpen(true)}
              className="relative flex items-center gap-1.5 px-2.5 h-9 rounded-duo-pill border-2 border-border bg-card hover:bg-muted transition-all active:translate-y-[1px]"
              title={t.header.notebook}
            >
              <BookMarked className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-bold hidden sm:inline">
                {t.header.notebook}
              </span>
              {savedNotebook.length > 0 && (
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-purple-600 text-white text-[11px] font-bold">
                  {savedNotebook.length}
                </span>
              )}
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={onToggleSound}
              className="flex items-center justify-center w-9 h-9 rounded-duo border-2 border-border bg-card hover:bg-muted transition-all active:translate-y-[1px]"
              title={soundEnabled ? t.header.soundOn : t.header.soundOff}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-primary" />
              ) : (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="flex items-center justify-center w-9 h-9 rounded-duo border-2 border-border bg-card hover:bg-muted transition-all active:translate-y-[1px]"
              title="Dark / Light Mode"
            >
              {darkMode ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </button>

            {/* Language Toggle */}
            <button
              type="button"
              onClick={onToggleLocale}
              className="flex items-center gap-1 px-2.5 h-9 rounded-duo border-2 border-border bg-card hover:bg-muted text-xs font-bold transition-all active:translate-y-[1px]"
            >
              <Globe className="h-3.5 w-3.5 text-primary" />
              <span>{locale === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}</span>
            </button>

            {/* User Profile Button */}
            <button
              type="button"
              onClick={() => {
                setEditName(currentUser.displayName);
                setEditAvatar(currentUser.avatar);
                setProfileOpen(true);
              }}
              className="flex items-center gap-2 pl-2 pr-3 h-9 rounded-duo-pill border-2 border-primary/30 bg-primary/10 hover:bg-primary/15 transition-all active:translate-y-[1px]"
              title={t.header.editProfile}
            >
              <span className="text-base leading-none">
                {currentUser.avatar}
              </span>
              <span className="text-xs font-bold max-w-[90px] sm:max-w-[130px] truncate">
                {currentUser.displayName}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Dictionary Modal */}
      {dictOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="duo-card w-full max-w-2xl rounded-duo-lg overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b-2 border-border">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-base">
                <Search className="h-5 w-5 text-primary" />
                <span>{t.header.dictionary}</span>
              </div>
              <button
                type="button"
                onClick={() => setDictOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập từ tiếng Anh hoặc nghĩa tiếng Việt cần tra..."
                  autoFocus
                  className="w-full h-11 pl-11 pr-10 rounded-duo border-2 border-border bg-muted/40 focus:border-primary focus:outline-none text-sm font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {searchQuery.trim().length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  Nhập từ tiếng Anh hoặc tiếng Việt để tra cứu nhanh trong kho{' '}
                  <b>{BUILTIN_VOCAB_CARDS.length}</b> từ vựng trọng tâm.
                </div>
              ) : filteredCards.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  Không tìm thấy kết quả cho "{searchQuery}".
                </div>
              ) : (
                filteredCards.map((c) => {
                  const saved = isCardSaved(c.cardId);
                  return (
                    <div
                      key={c.cardId}
                      className="rounded-duo border-2 border-border p-3.5 flex items-start justify-between gap-3 bg-card hover:border-primary/40 transition-colors"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-base text-primary">
                            {c.word}
                          </span>
                          <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                            {c.type}
                          </span>
                          <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                            {c.level}
                          </span>
                          {c.phonetics[0]?.text && (
                            <span className="text-xs text-muted-foreground font-mono">
                              /{c.phonetics[0].text}/
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              soundManager.speakWord(
                                c.word,
                                c.phonetics[0]?.audio
                              )
                            }
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-50 dark:bg-pink-950/40 text-pink-600 hover:bg-pink-100 text-xs font-bold"
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                            US
                          </button>
                        </div>
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {c.translation.vi}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {c.explanation.vi}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSaveCard(c)}
                        disabled={saved}
                        className={`px-3 py-1.5 rounded-duo text-xs font-bold flex items-center gap-1 shrink-0 ${
                          saved
                            ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                            : 'duo-btn-primary'
                        }`}
                      >
                        {saved ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Đã lưu
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            Lưu
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notebook Modal */}
      {notebookOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="duo-card w-full max-w-2xl rounded-duo-lg overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b-2 border-border">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-base">
                <BookMarked className="h-5 w-5 text-purple-600" />
                <span>
                  {t.header.notebook} ({savedNotebook.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setNotebookOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {savedNotebook.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  Chưa có từ vựng nào trong sổ tay. Hãy bấm nút{' '}
                  <b>"Lưu vào sổ tay"</b> sau mỗi vòng đấu để lưu lại các từ mới!
                </div>
              ) : (
                savedNotebook.map(({ card: c }) => (
                  <div
                    key={c.cardId}
                    className="rounded-duo border-2 border-border p-3.5 flex items-start justify-between gap-3 bg-card"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-base text-primary">
                          {c.word}
                        </span>
                        <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                          {c.type}
                        </span>
                        {c.phonetics[0]?.text && (
                          <span className="text-xs text-muted-foreground font-mono">
                            /{c.phonetics[0].text}/
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            soundManager.speakWord(
                              c.word,
                              c.phonetics[0]?.audio
                            )
                          }
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-50 dark:bg-pink-950/40 text-pink-600 hover:bg-pink-100 text-xs font-bold"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                          Nghe
                        </button>
                      </div>
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {c.translation.vi}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {c.explanation.vi}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveSavedCard(c.cardId)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Xóa khỏi sổ tay"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {profileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="duo-card w-full max-w-md rounded-duo-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-base">
                <User className="h-5 w-5 text-primary" />
                <span>{t.header.editProfile}</span>
              </div>
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="p-1 rounded-lg hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5">
                  Tên hiển thị với bạn bè
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={24}
                  placeholder="Nhập tên của bạn..."
                  className="w-full h-11 px-3.5 rounded-duo border-2 border-border bg-muted/40 focus:border-primary focus:outline-none font-semibold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5">
                  Chọn Avatar
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_PRESETS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setEditAvatar(av)}
                      className={`h-11 rounded-duo border-2 text-xl flex items-center justify-center transition-all ${
                        editAvatar === av
                          ? 'border-purple-600 bg-purple-500/15 scale-105 shadow-duo-sm'
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="duo-btn-outline px-4 py-2 text-sm"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  if (editName.trim()) {
                    onUpdateUser(editName.trim(), editAvatar);
                    setProfileOpen(false);
                  }
                }}
                className="duo-btn-purple px-5 py-2 text-sm"
              >
                Lưu Hồ Sơ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
