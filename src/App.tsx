import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Wifi, X } from 'lucide-react';
import { AppHeader } from './components/AppHeader';
import { ParrotoLogo } from './components/ParrotoLogo';
import { VocabBattleLobby } from './components/VocabBattleLobby';
import { VocabBattleWaitingRoom } from './components/VocabBattleWaitingRoom';
import { VocabBattleGameStart } from './components/VocabBattleGameStart';
import { VocabBattleRound } from './components/VocabBattleRound';
import { VocabBattleGameOver } from './components/VocabBattleGameOver';
import { useVocabBattleP2P } from './hooks/useVocabBattleP2P';
import { parseCustomVocabulary } from './data/vocabDecks';
import { PlayerStats, SavedVocabItem, VocabCard } from './types/game';
import { Locale, TRANSLATIONS } from './i18n/translations';
import { soundManager } from './utils/sound';

function getOrCreateTabUserId(): string {
  if (typeof window === 'undefined') return 'user-local';
  let uid = sessionStorage.getItem('vb_tab_user_id');
  if (!uid) {
    uid = `p2p_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 7)}`;
    sessionStorage.setItem('vb_tab_user_id', uid);
  }
  return uid;
}

export function App() {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem('vb_locale');
    return saved === 'en' ? 'en' : 'vi';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('vb_dark_mode') === 'true';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return soundManager.enabled;
  });

  const [currentUser, setCurrentUser] = useState<{
    userId: string;
    displayName: string;
    avatar: string;
  }>(() => {
    const uid = getOrCreateTabUserId();
    const savedName = localStorage.getItem('vb_display_name');
    const savedAvatar = localStorage.getItem('vb_avatar') || '🦜';
    const randomSuffix = uid.slice(-3).toUpperCase();
    return {
      userId: uid,
      displayName: savedName || `Player ${randomSuffix}`,
      avatar: savedAvatar,
    };
  });

  const [stats, setStats] = useState<PlayerStats>(() => {
    try {
      const raw = localStorage.getItem('vb_player_stats');
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return {
      totalGames: 0,
      totalWins: 0,
      totalLosses: 0,
      totalDraws: 0,
      totalRoundsWon: 0,
    };
  });

  const [savedNotebook, setSavedNotebook] = useState<SavedVocabItem[]>(() => {
    try {
      const raw = localStorage.getItem('vb_saved_notebook');
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return [];
  });

  const [rawCustomText, setRawCustomText] = useState<string>(() => {
    return localStorage.getItem('vb_custom_vocab_raw') || '';
  });

  const [customCards, setCustomCards] = useState<VocabCard[]>(() => {
    const savedRaw = localStorage.getItem('vb_custom_vocab_raw') || '';
    return savedRaw ? parseCustomVocabulary(savedRaw) : [];
  });

  const [quitConfirmOpen, setQuitConfirmOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('vb_dark_mode', String(darkMode));
  }, [darkMode]);

  const handleUpdateStats = (updater: (prev: PlayerStats) => PlayerStats) => {
    setStats((prev) => {
      const next = updater(prev);
      localStorage.setItem('vb_player_stats', JSON.stringify(next));
      return next;
    });
  };

  const handleSaveCard = (c: VocabCard) => {
    setSavedNotebook((prev) => {
      if (prev.some((i) => i.card.cardId === c.cardId)) return prev;
      const next = [{ card: c, savedAt: new Date().toISOString() }, ...prev];
      localStorage.setItem('vb_saved_notebook', JSON.stringify(next));
      return next;
    });
  };

  const handleRemoveSavedCard = (cardId: string) => {
    setSavedNotebook((prev) => {
      const next = prev.filter((i) => i.card.cardId !== cardId);
      localStorage.setItem('vb_saved_notebook', JSON.stringify(next));
      return next;
    });
  };

  const handleUpdateUser = (displayName: string, avatar: string) => {
    localStorage.setItem('vb_display_name', displayName);
    localStorage.setItem('vb_avatar', avatar);
    setCurrentUser((prev) => ({ ...prev, displayName, avatar }));
  };

  const handleSaveCustomText = (raw: string, parsed: VocabCard[]) => {
    localStorage.setItem('vb_custom_vocab_raw', raw);
    setRawCustomText(raw);
    setCustomCards(parsed);
  };

  const {
    state,
    isConnecting,
    isConnectedP2P,
    pingMs,
    error,
    clearError,
    roomId,
    isHost,
    roomConfig,
    updateRoomConfig,
    players,
    opponent,
    currentRound,
    totalRounds,
    timeLeft,
    card,
    fullRevealedCard,
    wordMask,
    phoneticsHint,
    roundWinnerId,
    revealedWord,
    isTimeout,
    wrongAnswer,
    answerBubbles,
    gameOverData,
    rematchState,
    createRoom,
    joinRoom,
    startMatch,
    startBotMatch,
    submitAnswer,
    requestRematch,
    backToWaitingRoom,
    quitMatch,
    leaveRoom,
  } = useVocabBattleP2P(currentUser, customCards, handleUpdateStats);

  // Auto-join room from URL ?room=XXXXXX
  const autoJoinedRef = useRef(false);
  useEffect(() => {
    if (autoJoinedRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam && roomParam.trim()) {
      autoJoinedRef.current = true;
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
      joinRoom(roomParam.trim().toUpperCase());
    }
  }, [joinRoom]);

  const t = TRANSLATIONS[locale];
  const isInBattleOverlay =
    state === 'game-start' ||
    state === 'playing' ||
    state === 'round-result' ||
    state === 'game-over';

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      {!isInBattleOverlay && (
        <AppHeader
          locale={locale}
          onToggleLocale={() => {
            const next = locale === 'vi' ? 'en' : 'vi';
            setLocale(next);
            localStorage.setItem('vb_locale', next);
          }}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((d) => !d)}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            soundManager.setEnabled(next);
          }}
          currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
          savedNotebook={savedNotebook}
          onSaveCard={handleSaveCard}
          onRemoveSavedCard={handleRemoveSavedCard}
          isConnectedP2P={isConnectedP2P}
          pingMs={pingMs}
        />
      )}

      {/* Main Lobby or Waiting Room */}
      {!isInBattleOverlay && (
        <main className="flex-1 container mx-auto px-4 py-6 max-w-5xl">
          {/* Page Title */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-black mb-1.5 tracking-tight">
              {t.title}
            </h1>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              {t.subtitle}
            </p>
          </div>

          {/* Error Alert Banner */}
          {error && (
            <div className="mb-6 rounded-duo border-2 border-destructive/50 bg-destructive/10 px-4 py-3 flex items-center justify-between gap-3 max-w-3xl mx-auto">
              <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={clearError}
                className="p-1 rounded hover:bg-destructive/20 text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {state === 'room-waiting' && roomId ? (
            <VocabBattleWaitingRoom
              locale={locale}
              roomId={roomId}
              isHost={isHost}
              players={players}
              roomConfig={roomConfig}
              isConnectedP2P={isConnectedP2P}
              pingMs={pingMs}
              onUpdateConfig={updateRoomConfig}
              onStartMatch={startMatch}
              onLeaveRoom={leaveRoom}
            />
          ) : (
            <>
              <VocabBattleLobby
                locale={locale}
                currentUser={currentUser}
                stats={stats}
                roomConfig={roomConfig}
                onUpdateConfig={updateRoomConfig}
                onCreateRoom={createRoom}
                onJoinRoom={joinRoom}
                onStartBotMatch={startBotMatch}
                isConnecting={isConnecting}
                customCards={customCards}
                rawCustomText={rawCustomText}
                onSaveCustomText={handleSaveCustomText}
              />

              {/* How to Play Section (Parroto style) */}
              <section className="mt-10 max-w-4xl mx-auto pb-8">
                <h2 className="font-extrabold text-lg mb-4 text-center">
                  {t.seo.howToTitle}
                </h2>
                <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    t.seo.howToStep1,
                    t.seo.howToStep2,
                    t.seo.howToStep3,
                    t.seo.howToStep4,
                  ].map((stepText, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 rounded-duo border-2 border-border bg-card p-4 shadow-duo-sm"
                    >
                      <div className="shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground font-extrabold flex items-center justify-center text-sm shadow-duo-sm">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-foreground leading-relaxed pt-0.5">
                        {stepText}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            </>
          )}
        </main>
      )}

      {/* Fullscreen Battle Overlay (Parroto authentic layout) */}
      {isInBattleOverlay && (
        <div className="fixed inset-0 z-50 bg-background overflow-y-auto flex flex-col">
          {/* Sticky Top Bar */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b-2 border-border">
            <div className="px-4 h-13 flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (state === 'game-over') {
                      leaveRoom();
                    } else {
                      setQuitConfirmOpen(true);
                    }
                  }}
                  className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                  title="Thoát"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-2">
                  <ParrotoLogo size={32} />
                  <span className="font-extrabold text-lg text-primary">
                    Parroto
                  </span>
                </div>

                {isConnectedP2P && pingMs !== null && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                    <Wifi className="h-3 w-3" />
                    {pingMs}ms
                  </span>
                )}
              </div>

              {(state === 'playing' || state === 'round-result') && (
                <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 px-3 py-1 rounded-duo-pill shadow-duo-sm">
                  <span className="text-orange-500 text-xs">●</span>
                  <span className="text-sm font-extrabold text-orange-600 dark:text-orange-400 tabular-nums">
                    {t.game.timeLeft.replace('{{seconds}}', String(timeLeft))}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Battle Stage Content */}
          <div className="container mx-auto px-4 py-4 max-w-3xl flex-1 flex flex-col">
            {state === 'game-start' && opponent && (
              <VocabBattleGameStart
                locale={locale}
                currentUser={currentUser}
                opponent={opponent}
                roomConfig={roomConfig}
                totalRounds={totalRounds}
              />
            )}

            {(state === 'playing' || state === 'round-result') &&
              card &&
              opponent && (
                <VocabBattleRound
                  locale={locale}
                  userId={currentUser.userId}
                  currentUser={currentUser}
                  opponent={opponent}
                  round={currentRound}
                  totalRounds={totalRounds}
                  roundTimeSec={roomConfig.roundTimeSec}
                  timeLeft={timeLeft}
                  card={card}
                  fullRevealedCard={fullRevealedCard}
                  wordMask={wordMask}
                  phoneticsHint={phoneticsHint}
                  players={players}
                  wrongAnswer={wrongAnswer}
                  answerBubbles={answerBubbles}
                  showResult={state === 'round-result'}
                  roundWinnerId={roundWinnerId}
                  revealedWord={revealedWord}
                  isTimeout={isTimeout}
                  onSubmitAnswer={submitAnswer}
                  onSaveCard={handleSaveCard}
                  isCardSaved={savedNotebook.some(
                    (i) => i.card.cardId === card.cardId
                  )}
                />
              )}

            {state === 'game-over' && gameOverData && opponent && (
              <VocabBattleGameOver
                locale={locale}
                userId={currentUser.userId}
                currentUser={currentUser}
                opponent={opponent}
                gameOverData={gameOverData}
                rematchState={rematchState}
                onRematch={requestRematch}
                onBackToRoom={backToWaitingRoom}
                onLeaveRoom={leaveRoom}
                savedNotebook={savedNotebook}
                onSaveCard={handleSaveCard}
              />
            )}
          </div>
        </div>
      )}

      {/* Quit Match Confirmation Dialog */}
      {quitConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="duo-card max-w-sm w-full p-6 space-y-4 text-center">
            <h3 className="font-extrabold text-lg">
              {t.game.quitConfirmTitle}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t.game.quitConfirmMessage}
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => setQuitConfirmOpen(false)}
                className="duo-btn-outline px-5 py-2.5 text-sm flex-1"
              >
                {t.game.quitConfirmNo}
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuitConfirmOpen(false);
                  quitMatch();
                }}
                className="duo-btn-danger px-5 py-2.5 text-sm flex-1"
              >
                {t.game.quitConfirmYes}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
