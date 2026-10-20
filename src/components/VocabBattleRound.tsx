import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Bookmark,
  Check,
  Crown,
  Languages,
  Lock,
  MessageSquare,
  Rocket,
  SendHorizontal,
  Tag,
  Volume2,
} from 'lucide-react';
import {
  AnswerBubble,
  PhoneticItem,
  PlayerInfo,
  PublicRoundCard,
  VocabCard,
} from '../types/game';
import { Locale, TRANSLATIONS } from '../i18n/translations';
import { soundManager } from '../utils/sound';

interface VocabBattleRoundProps {
  locale: Locale;
  userId: string;
  currentUser: { userId: string; displayName: string; avatar: string };
  opponent: PlayerInfo;
  round: number;
  totalRounds: number;
  roundTimeSec: number;
  timeLeft: number;
  card: PublicRoundCard;
  fullRevealedCard: VocabCard | null;
  wordMask: string;
  phoneticsHint: PhoneticItem[] | null;
  players: PlayerInfo[];
  wrongAnswer: boolean;
  answerBubbles: AnswerBubble[];
  showResult: boolean;
  roundWinnerId: string | null;
  revealedWord: string | null;
  isTimeout: boolean;
  onSubmitAnswer: (answer: string) => void;
  onSaveCard: (card: VocabCard) => void;
  isCardSaved: boolean;
}

const WRONG_TAUNTS = [
  'ngu lớm 🤪',
  'hí ộ 😂',
  'bựa 🤣',
  'npc 🤖',
  'gà thế 🐔',
  'non và xanh 🌱',
  'sai bét nhè 🤡',
  'tay nhanh hơn não 🧠',
  'ảo ma thế 👻',
  'chưa học bài à 📚',
  'lag não à 🫠',
  'ố dồi ôi 😱',
];

interface TauntToast {
  id: number;
  text: string;
  answer: string;
  isOpponent: boolean;
  playerName: string;
}

export const VocabBattleRound: React.FC<VocabBattleRoundProps> = ({
  locale,
  userId,
  currentUser,
  opponent,
  round,
  totalRounds,
  roundTimeSec,
  timeLeft,
  card,
  fullRevealedCard,
  wordMask,
  phoneticsHint,
  players,
  wrongAnswer,
  answerBubbles,
  showResult,
  roundWinnerId,
  revealedWord,
  isTimeout,
  onSubmitAnswer,
  onSaveCard,
  isCardSaved,
}) => {
  const t = TRANSLATIONS[locale];
  const [hintLang, setHintLang] = useState<'vi' | 'en'>('vi');
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastCardIdRef = useRef<string | null>(null);

  const [youScoredAnim, setYouScoredAnim] = useState(false);
  const [oppScoredAnim, setOppScoredAnim] = useState(false);
  const [tauntToasts, setTauntToasts] = useState<TauntToast[]>([]);
  const lastBubbleIdRef = useRef<number>(0);
  const lastTauntIdxRef = useRef<number>(-1);

  const myPlayer = players.find((p) => p.userId === userId);
  const oppPlayer = players.find((p) => p.userId !== userId);
  const myScore = myPlayer?.score ?? 0;
  const oppScore = oppPlayer?.score ?? 0;

  const youWonRound = roundWinnerId === userId;
  const oppWonRound = roundWinnerId !== null && roundWinnerId !== userId;

  useEffect(() => {
    if (answerBubbles.length === 0) return;
    const latest = answerBubbles[answerBubbles.length - 1];
    if (!latest || latest.id === lastBubbleIdRef.current) return;
    lastBubbleIdRef.current = latest.id;

    if (!latest.correct) {
      let idx = Math.floor(Math.random() * WRONG_TAUNTS.length);
      if (idx === lastTauntIdxRef.current) {
        idx = (idx + 1) % WRONG_TAUNTS.length;
      }
      lastTauntIdxRef.current = idx;
      const tauntText = WRONG_TAUNTS[idx];

      const newToast: TauntToast = {
        id: latest.id,
        text: tauntText,
        answer: latest.answer,
        isOpponent: latest.isOpponent,
        playerName: latest.playerName,
      };
      setTauntToasts((prev) => [...prev.slice(-2), newToast]);

      const timer = window.setTimeout(() => {
        setTauntToasts((prev) => prev.filter((item) => item.id !== latest.id));
      }, 2200);
      return () => window.clearTimeout(timer);
    }
  }, [answerBubbles]);

  useEffect(() => {
    if (card.cardId && card.cardId !== lastCardIdRef.current) {
      lastCardIdRef.current = card.cardId;
      setInputValue('');
      setTauntToasts([]);
      lastBubbleIdRef.current = 0;
      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 60);
    }
  }, [card.cardId]);

  useEffect(() => {
    if (showResult && !isTimeout) {
      if (youWonRound) {
        setYouScoredAnim(true);
        setOppScoredAnim(false);
      } else if (oppWonRound) {
        setOppScoredAnim(true);
        setYouScoredAnim(false);
      }
    }
  }, [showResult, isTimeout, youWonRound, oppWonRound]);

  useEffect(() => {
    setYouScoredAnim(false);
    setOppScoredAnim(false);
  }, [round]);

  const progressPercent = Math.max(
    0,
    Math.min(100, (timeLeft / Math.max(1, roundTimeSec)) * 100)
  );

  const isPronunciationUnlocked = showResult || !!phoneticsHint;
  const ipaText = phoneticsHint?.[0]?.text || '';
  const audioUrl = phoneticsHint?.[0]?.audio;

  const translationText =
    hintLang === 'vi' ? card.translation.vi : card.translation.en;
  const explanationText =
    hintLang === 'vi' ? card.explanation.vi : card.explanation.en;
  const exampleEn = card.exampleMasked.en;
  const exampleVi = card.exampleMasked.vi;

  const renderExampleSentence = () => {
    if (showResult && revealedWord) {
      const match = exampleEn.match(/\*+/);
      if (!match || match.index === undefined) {
        return <span>{exampleEn}</span>;
      }
      const start = match.index;
      const len = match[0].length;
      return (
        <>
          {start > 0 && <span>{exampleEn.substring(0, start)}</span>}
          <span className="text-green-600 dark:text-green-400 font-bold underline decoration-green-500/50">
            {revealedWord}
          </span>
          {start + len < exampleEn.length && (
            <span>{exampleEn.substring(start + len)}</span>
          )}
        </>
      );
    }

    return exampleEn.split(/(\*+)/).map((part, idx) =>
      /^\*+$/.test(part) ? (
        <span key={idx} className="text-purple-500 font-bold">
          {part}
        </span>
      ) : (
        <span key={idx}>{part}</span>
      )
    );
  };

  return (
    <div className="flex flex-col w-full max-w-2xl sm:max-w-3xl mx-auto flex-1">
      {/* Top Scoreboard Header (Parroto style without diamonds) */}
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-purple-50 via-white to-pink-50 dark:from-purple-950/40 dark:via-background dark:to-pink-950/40 border-2 border-purple-200 dark:border-purple-800 px-3.5 py-3 mb-4 shadow-sm">
        {/* Left: You */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="h-10 w-10 rounded-full border-2 border-purple-500 bg-purple-500/10 flex items-center justify-center text-xl shrink-0">
            {currentUser.avatar}
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold truncate max-w-[95px] sm:max-w-[140px]">
              {currentUser.displayName}
            </p>
            <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
              {locale === 'vi' ? 'Bạn' : 'You'}
            </span>
          </div>
        </div>

        {/* Center: Score */}
        <div className="shrink-0 flex flex-col items-center px-4 relative">
          <div className="flex items-center gap-2.5 tabular-nums">
            <span
              className={`text-2xl font-black transition-all duration-300 ${
                youScoredAnim
                  ? 'text-green-600 scale-125'
                  : 'text-purple-600 dark:text-purple-400'
              }`}
            >
              {myScore}
            </span>
            <span className="text-xs font-bold text-muted-foreground">-</span>
            <span
              className={`text-2xl font-black transition-all duration-300 ${
                oppScoredAnim
                  ? 'text-green-600 scale-125'
                  : 'text-pink-600 dark:text-pink-400'
              }`}
            >
              {oppScore}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            {t.game.score}
          </span>
          {youScoredAnim && (
            <span className="absolute -top-3 left-1/4 text-sm font-black text-green-500 animate-score-float pointer-events-none">
              +1
            </span>
          )}
          {oppScoredAnim && (
            <span className="absolute -top-3 right-1/4 text-sm font-black text-green-500 animate-score-float pointer-events-none">
              +1
            </span>
          )}
        </div>

        {/* Right: Opponent */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
          <div className="min-w-0 text-right">
            <p className="text-xs sm:text-sm font-bold truncate max-w-[95px] sm:max-w-[140px] ml-auto">
              {opponent.displayName}
            </p>
            <span className="text-[11px] font-semibold text-pink-600 dark:text-pink-400">
              {opponent.isBot ? 'AI Bot' : locale === 'vi' ? 'Đối thủ' : 'Opponent'}
            </span>
          </div>
          <div className="h-10 w-10 rounded-full border-2 border-pink-500 bg-pink-500/10 flex items-center justify-center text-xl shrink-0">
            {opponent.avatar}
          </div>
        </div>
      </div>

      {/* Round Badge & Hint Language Switcher */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 px-3 py-1 rounded-full">
            {t.game.round
              .replace('{{current}}', String(round))
              .replace('{{total}}', String(totalRounds))}
          </span>
          <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
            {card.level}
          </span>
        </div>

        <div className="inline-flex items-center rounded-lg border border-border bg-muted/40 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setHintLang('vi')}
            className={`px-2 py-1 rounded-md font-semibold transition-all ${
              hintLang === 'vi'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground'
            }`}
          >
            🇻🇳 Tiếng Việt
          </button>
          <button
            type="button"
            onClick={() => setHintLang('en')}
            className={`px-2 py-1 rounded-md font-semibold transition-all ${
              hintLang === 'en'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground'
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      </div>

      {/* Main Content Area: Left Space Rocket Race + Right Vocabulary Card */}
      <div className="flex gap-3 flex-1">
        {/* Left Vertical Space Rocket Track (Parroto signature UI) */}
        <div className="hidden sm:flex flex-col items-center w-14 shrink-0 relative rounded-xl bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 border border-indigo-500/30 py-3 overflow-hidden min-h-[340px]">
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-40"
              style={{
                left: `${15 + ((31 * idx) % 70)}%`,
                top: `${5 + ((23 * idx) % 90)}%`,
              }}
            />
          ))}

          <div className="flex flex-col items-center gap-0.5 z-10 mb-1">
            <Crown className="h-4 w-4 text-yellow-400" />
            <span className="text-[9px] text-yellow-400/70 font-bold">
              {totalRounds}
            </span>
          </div>

          <div className="flex-1 w-full relative">
            <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 border-l border-dashed border-indigo-500/20" />
            <div className="absolute inset-x-0 top-2 bottom-2 flex flex-col justify-between items-center pointer-events-none">
              {[...Array(totalRounds)].map((_, idx) => {
                const step = totalRounds - 1 - idx;
                return (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full z-10 ${
                      step < Math.max(myScore, oppScore)
                        ? 'bg-indigo-400/50'
                        : 'bg-indigo-700/30'
                    }`}
                  />
                );
              })}
            </div>

            {/* Your Rocket (Purple) */}
            <div
              className={`absolute left-0.5 flex flex-col items-center transition-all duration-700 ease-out z-20 ${
                youScoredAnim ? 'animate-rocket-boost' : ''
              }`}
              style={{
                bottom: `${Math.min((myScore / totalRounds) * 85 + 2, 87)}%`,
              }}
            >
              <div className="relative flex flex-col items-center">
                <Rocket className="h-5 w-5 text-purple-400 -rotate-45 drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
                <div
                  className={`-mt-1 ${
                    youScoredAnim || !showResult ? 'animate-rocket-flame' : ''
                  }`}
                >
                  <div className="w-2 h-3 bg-gradient-to-b from-orange-400 via-yellow-400 to-transparent rounded-full opacity-80" />
                </div>
              </div>
            </div>

            {/* Opponent Rocket (Pink) */}
            <div
              className={`absolute right-0.5 flex flex-col items-center transition-all duration-700 ease-out z-20 ${
                oppScoredAnim ? 'animate-rocket-boost' : ''
              }`}
              style={{
                bottom: `${Math.min((oppScore / totalRounds) * 85 + 2, 87)}%`,
              }}
            >
              <div className="relative flex flex-col items-center">
                <Rocket className="h-5 w-5 text-pink-400 -rotate-45 drop-shadow-[0_0_6px_rgba(236,72,153,0.6)]" />
                <div
                  className={`-mt-1 ${
                    oppScoredAnim || !showResult ? 'animate-rocket-flame' : ''
                  }`}
                >
                  <div className="w-2 h-3 bg-gradient-to-b from-red-400 via-orange-400 to-transparent rounded-full opacity-80" />
                </div>
              </div>
            </div>
          </div>

          <span className="text-[9px] text-indigo-400/60 font-bold mt-1 z-10">
            START
          </span>
        </div>

        {/* Right: Vocabulary Question Card */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Top Countdown Progress Bar */}
          <div className="relative h-2.5 w-full overflow-hidden rounded-t-xl bg-primary/15">
            <div
              className={`h-full w-full transition-all duration-300 ease-linear ${
                timeLeft <= 5
                  ? 'bg-red-500'
                  : timeLeft <= 10
                  ? 'bg-orange-500'
                  : 'bg-orange-400'
              }`}
              style={{
                transform: `translateX(-${100 - progressPercent}%)`,
              }}
            />
          </div>

          <div className="duo-card border-t-0 rounded-t-none mb-4 p-4 sm:p-6 space-y-4">
            {/* Word Mask Boxes OR Revealed Word */}
            <div className="flex items-center justify-center gap-3 py-3 flex-wrap">
              {showResult && revealedWord ? (
                <>
                  <span className="text-2xl sm:text-3xl font-extrabold text-green-600 dark:text-green-400 tracking-wide">
                    {revealedWord}
                  </span>
                  {fullRevealedCard && (
                    <button
                      type="button"
                      onClick={() => onSaveCard(fullRevealedCard)}
                      disabled={isCardSaved}
                      className={`h-8 px-3 rounded-duo text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isCardSaved
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                          : 'duo-btn-primary'
                      }`}
                    >
                      {isCardSaved ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>{t.game.savedToNotebook}</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-3.5 w-3.5" />
                          <span>{t.game.saveToNotebook}</span>
                        </>
                      )}
                    </button>
                  )}
                </>
              ) : (
                <div className="flex gap-1.5 flex-wrap justify-center">
                  {wordMask.split('').map((ch, idx) => {
                    if (ch === ' ') {
                      return <span key={idx} className="w-3" />;
                    }
                    const isRevealed = ch !== '_';
                    return (
                      <span
                        key={idx}
                        className={`w-7 h-9 sm:w-8 sm:h-10 rounded-md flex items-center justify-center text-lg font-extrabold border-2 transition-all duration-300 ${
                          isRevealed
                            ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400'
                            : 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800 text-purple-400 dark:text-purple-500'
                        }`}
                      >
                        {isRevealed ? ch : ''}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Clues / Hints Section */}
            <div className="space-y-2.5 text-sm">
              {/* 1. Translation (Blue Highlight Box) */}
              {hintLang !== 'en' && (
                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg px-3.5 py-2 border border-blue-200 dark:border-blue-800">
                  <Languages className="h-5 w-5 text-blue-600 shrink-0" />
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0">
                    {t.game.hintTranslation}:
                  </span>
                  <span className="text-base font-extrabold text-blue-700 dark:text-blue-300">
                    {translationText}
                  </span>
                </div>
              )}

              {/* 2. Explanation */}
              {explanationText && (
                <div className="flex items-start gap-2">
                  <BookOpen className="h-4 w-4 mt-0.5 text-amber-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {t.game.hintExplanation}:
                    </span>{' '}
                    <span className="text-muted-foreground">
                      {explanationText}
                    </span>
                  </div>
                </div>
              )}

              {/* 3. Example Sentence */}
              {exampleEn && (
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 mt-0.5 text-green-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {t.game.hintExample}:
                    </span>{' '}
                    <span className="italic">"{renderExampleSentence()}"</span>
                    {exampleVi && hintLang === 'vi' && (
                      <span className="text-muted-foreground block mt-0.5 text-xs">
                        {exampleVi}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* 4. Part of Speech */}
              {card.type && (
                <div className="flex items-start gap-2">
                  <Tag className="h-4 w-4 mt-0.5 text-indigo-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {t.game.hintType}:
                    </span>{' '}
                    <span className="font-medium capitalize">{card.type}</span>
                  </div>
                </div>
              )}

              {/* 5. Pronunciation Hint (Unlocks mid-round or at round end) */}
              {isPronunciationUnlocked ? (
                <div className="flex items-center gap-2 animate-in fade-in duration-300">
                  <Volume2 className="h-4 w-4 text-pink-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-pink-600 dark:text-pink-400">
                      {t.game.hintPronunciation}:
                    </span>{' '}
                    {ipaText && (
                      <span className="font-mono text-foreground">
                        /{ipaText}/
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      soundManager.speakWord(revealedWord || '', audioUrl)
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-100/70 dark:bg-pink-900/30 hover:bg-pink-200/70 shrink-0 transition-colors"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>Nghe</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                  <span className="text-muted-foreground/50 text-xs">
                    {t.game.hintPronunciationLocked}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Wrong Answer Taunt Toasts ("ngu lớm", "hí ộ", "bựa", "npc"...) */}
      {!showResult && tauntToasts.length > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5 pointer-events-none w-full max-w-md px-4">
          {tauntToasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-4 py-1.5 rounded-full border-2 shadow-lg text-xs sm:text-sm font-extrabold flex items-center gap-2 animate-bounce ${
                toast.isOpponent
                  ? 'bg-pink-600 text-white border-pink-300'
                  : 'bg-red-600 text-white border-amber-300'
              }`}
            >
              <span>{toast.isOpponent ? '👀' : '💀'}</span>
              <span className="opacity-90 font-semibold">
                {toast.isOpponent ? `${toast.playerName}:` : 'Sai rồi:'}
              </span>
              <span className="underline decoration-white/60">
                "{toast.answer}"
              </span>
              <span className="bg-black/25 px-2 py-0.5 rounded-full text-amber-200 uppercase tracking-wide">
                {toast.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Fixed Bottom Answer Input Bar + Real-time Answer Bubbles */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t-2 border-border">
        <div className="container mx-auto max-w-3xl px-4 py-3">
          {showResult ? (
            <div className="text-center py-2 animate-in fade-in duration-200">
              <p
                className={`text-lg font-extrabold ${
                  isTimeout
                    ? 'text-yellow-600'
                    : youWonRound
                    ? 'text-green-600'
                    : 'text-red-500'
                }`}
              >
                {isTimeout
                  ? t.game.timeout
                  : youWonRound
                  ? t.game.youWonRound
                  : t.game.youLostRound}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t.game.nextRound}
              </p>
            </div>
          ) : (
            <>
              {/* Real-time Guess Bubbles */}
              {answerBubbles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2.5 max-h-20 overflow-y-auto">
                  {answerBubbles.slice(-8).map((b) => (
                    <span
                      key={b.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold animate-in fade-in duration-150 ${
                        b.correct
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300'
                          : b.isOpponent
                          ? 'bg-pink-100/80 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border border-pink-200 dark:border-pink-800'
                          : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800'
                      }`}
                    >
                      <span className="text-[10px] opacity-75 font-bold">
                        {b.isOpponent ? opponent.displayName : 'Bạn'}:
                      </span>
                      <span className={!b.correct ? 'line-through opacity-80' : ''}>
                        {b.answer}
                      </span>
                      {!b.correct && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-red-500/15 text-red-600 dark:text-red-300">
                          {WRONG_TAUNTS[b.id % WRONG_TAUNTS.length]}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              )}

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (inputValue.trim() && !showResult) {
                    onSubmitAnswer(inputValue);
                    setInputValue('');
                  }
                }}
                className="flex gap-3 items-center"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t.game.inputPlaceholder}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className={`flex-1 h-12 rounded-full bg-muted border-2 border-transparent focus:border-purple-500 focus:bg-background focus:outline-none px-5 text-base font-semibold transition-all ${
                    wrongAnswer ? 'ring-2 ring-red-500 animate-shake' : ''
                  }`}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-md transition-all active:scale-95"
                >
                  <SendHorizontal className="h-5 w-5" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <div className="h-32" />
    </div>
  );
};
