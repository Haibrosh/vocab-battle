import { useCallback, useEffect, useRef, useState } from 'react';
import Peer, { DataConnection } from 'peerjs';
import {
  AnswerBubble,
  GameOverData,
  GameState,
  MatchRoundSummary,
  P2PMessage,
  PhoneticItem,
  PlayerInfo,
  PlayerStats,
  PublicRoundCard,
  RematchState,
  RoomConfig,
  VocabCard,
} from '../types/game';
import {
  createInitialMask,
  pickBattleCards,
  revealNextLetters,
} from '../data/vocabDecks';
import { soundManager } from '../utils/sound';

const PEER_PREFIX = 'parroto-vb-p2p-';
const BC_PREFIX = 'parroto-vb-bc-';

interface Envelope {
  _msgId: string;
  payload: P2PMessage;
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function useVocabBattleP2P(
  currentUser: { userId: string; displayName: string; avatar: string },
  customCards: VocabCard[],
  onStatsUpdate: (updater: (prev: PlayerStats) => PlayerStats) => void
) {
  const [state, setState] = useState<GameState>('idle');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnectedP2P, setIsConnectedP2P] = useState(false);
  const [pingMs, setPingMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [roomId, setRoomId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [isBotMatch, setIsBotMatch] = useState<boolean>(false);

  const [roomConfig, setRoomConfig] = useState<RoomConfig>({
    deckId: 'all',
    totalRounds: 10,
    roundTimeSec: 30,
    progressiveHints: true,
    isPublic: true,
  });

  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [totalRounds, setTotalRounds] = useState<number>(10);
  const [timeLeft, setTimeLeft] = useState<number>(30);

  const [card, setCard] = useState<PublicRoundCard | null>(null);
  const [fullRevealedCard, setFullRevealedCard] = useState<VocabCard | null>(null);
  const [wordMask, setWordMask] = useState<string>('');
  const [phoneticsHint, setPhoneticsHint] = useState<PhoneticItem[] | null>(null);

  const [roundWinnerId, setRoundWinnerId] = useState<string | null>(null);
  const [revealedWord, setRevealedWord] = useState<string | null>(null);
  const [isTimeout, setIsTimeout] = useState<boolean>(false);
  const [wrongAnswer, setWrongAnswer] = useState<boolean>(false);
  const [answerBubbles, setAnswerBubbles] = useState<AnswerBubble[]>([]);
  const [gameOverData, setGameOverData] = useState<GameOverData | null>(null);
  const [rematchState, setRematchState] = useState<RematchState>('idle');

  // Refs for mutable state inside callbacks/timers
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);
  const seenMsgIdsRef = useRef<Set<string>>(new Set());

  const stateRef = useRef<GameState>(state);
  stateRef.current = state;
  const isHostRef = useRef<boolean>(isHost);
  isHostRef.current = isHost;
  const isBotMatchRef = useRef<boolean>(isBotMatch);
  isBotMatchRef.current = isBotMatch;
  const roomConfigRef = useRef<RoomConfig>(roomConfig);
  roomConfigRef.current = roomConfig;
  const playersRef = useRef<PlayerInfo[]>(players);
  playersRef.current = players;
  const currentUserRef = useRef(currentUser);
  currentUserRef.current = currentUser;
  const customCardsRef = useRef(customCards);
  customCardsRef.current = customCards;
  const rematchStateRef = useRef<RematchState>(rematchState);
  rematchStateRef.current = rematchState;

  // Host game engine refs
  const battleCardsRef = useRef<VocabCard[]>([]);
  const currentRoundIdxRef = useRef<number>(0);
  const currentMaskRef = useRef<string>('');
  const roundStartTimeRef = useRef<number>(0);
  const matchHistoryRef = useRef<MatchRoundSummary[]>([]);

  // Timers
  const countdownTimerRef = useRef<number | null>(null);
  const hintTimersRef = useRef<number[]>([]);
  const nextRoundTimerRef = useRef<number | null>(null);
  const botTimersRef = useRef<number[]>([]);
  const pingIntervalRef = useRef<number | null>(null);
  const bubbleSeqRef = useRef<number>(0);

  const clearAllGameTimers = useCallback(() => {
    if (countdownTimerRef.current) {
      window.clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    hintTimersRef.current.forEach((id) => window.clearTimeout(id));
    hintTimersRef.current = [];
    if (nextRoundTimerRef.current) {
      window.clearTimeout(nextRoundTimerRef.current);
      nextRoundTimerRef.current = null;
    }
    botTimersRef.current.forEach((id) => window.clearTimeout(id));
    botTimersRef.current = [];
  }, []);

  const cleanupNetwork = useCallback(() => {
    clearAllGameTimers();
    if (pingIntervalRef.current) {
      window.clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    if (connRef.current) {
      try {
        connRef.current.close();
      } catch {
        // ignore
      }
      connRef.current = null;
    }
    if (peerRef.current) {
      try {
        peerRef.current.destroy();
      } catch {
        // ignore
      }
      peerRef.current = null;
    }
    if (bcRef.current) {
      try {
        bcRef.current.close();
      } catch {
        // ignore
      }
      bcRef.current = null;
    }
    setIsConnectedP2P(false);
    setPingMs(null);
  }, [clearAllGameTimers]);

  const sendP2P = useCallback((payload: P2PMessage) => {
    const env: Envelope = {
      _msgId: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      payload,
    };
    seenMsgIdsRef.current.add(env._msgId);

    if (connRef.current && connRef.current.open) {
      try {
        connRef.current.send(env);
      } catch {
        // ignore
      }
    }
    if (bcRef.current) {
      try {
        bcRef.current.postMessage(env);
      } catch {
        // ignore
      }
    }
  }, []);

  const startLocalCountdown = useCallback(
    (timeMs: number) => {
      if (countdownTimerRef.current) {
        window.clearInterval(countdownTimerRef.current);
      }
      const totalSec = Math.max(1, Math.round(timeMs / 1000));
      setTimeLeft(totalSec);
      const endAt = Date.now() + timeMs;
      countdownTimerRef.current = window.setInterval(() => {
        const rem = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
        setTimeLeft(rem);
        if (rem <= 0 && countdownTimerRef.current) {
          window.clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
      }, 250);
    },
    []
  );

  // Host-only: Finish game and broadcast GAME_OVER
  const hostFinishGame = useCallback(
    (
      reason: GameOverData['reason'],
      quitterId?: string
    ) => {
      clearAllGameTimers();
      const currentPlayers = playersRef.current;
      const p1 = currentPlayers[0];
      const p2 = currentPlayers[1];

      let winnerId: string | null = null;
      let loserId: string | null = null;

      if (reason === 'player_quit' || reason === 'player_disconnected') {
        const quitter = currentPlayers.find((p) => p.userId === quitterId);
        const other = currentPlayers.find((p) => p.userId !== quitterId);
        winnerId = other ? other.userId : null;
        loserId = quitter ? quitter.userId : null;
      } else if (p1 && p2) {
        if (p1.score > p2.score) {
          winnerId = p1.userId;
          loserId = p2.userId;
        } else if (p2.score > p1.score) {
          winnerId = p2.userId;
          loserId = p1.userId;
        }
      }

      const data: GameOverData = {
        winnerId,
        loserId,
        reason,
        quitterId,
        players: currentPlayers,
        history: matchHistoryRef.current,
        canRematch: reason === 'all_rounds_done',
      };

      setGameOverData(data);
      setRematchState('idle');
      setState('game-over');
      soundManager.play('complete');

      // Record local stats for host
      const myPlayer = currentPlayers.find(
        (p) => p.userId === currentUserRef.current.userId
      );
      onStatsUpdate((prev) => ({
        totalGames: prev.totalGames + 1,
        totalWins:
          winnerId === currentUserRef.current.userId
            ? prev.totalWins + 1
            : prev.totalWins,
        totalLosses:
          loserId === currentUserRef.current.userId
            ? prev.totalLosses + 1
            : prev.totalLosses,
        totalDraws:
          winnerId === null ? prev.totalDraws + 1 : prev.totalDraws,
        totalRoundsWon: prev.totalRoundsWon + (myPlayer?.score || 0),
      }));

      sendP2P({ type: 'GAME_OVER', data });
    },
    [clearAllGameTimers, onStatsUpdate, sendP2P]
  );

  // Host-only: Start a specific round (0-indexed)
  const hostStartRound = useCallback(
    (roundIdx: number) => {
      clearAllGameTimers();
      const targetCard = battleCardsRef.current[roundIdx];
      if (!targetCard) {
        hostFinishGame('all_rounds_done');
        return;
      }

      currentRoundIdxRef.current = roundIdx;
      const roundNumber = roundIdx + 1;
      const total = battleCardsRef.current.length;
      const timeSec = roomConfigRef.current.roundTimeSec;
      const timeMs = timeSec * 1000;
      const initialMask = createInitialMask(targetCard.word);
      currentMaskRef.current = initialMask;
      roundStartTimeRef.current = Date.now();

      const publicCard: PublicRoundCard = {
        cardId: targetCard.cardId,
        type: targetCard.type,
        level: targetCard.level,
        deckId: targetCard.deckId,
        wordMask: initialMask,
        translation: targetCard.translation,
        explanation: targetCard.explanation,
        exampleMasked: targetCard.exampleMasked,
      };

      setCurrentRound(roundNumber);
      setTotalRounds(total);
      setCard(publicCard);
      setFullRevealedCard(null);
      setWordMask(initialMask);
      setPhoneticsHint(null);
      setRoundWinnerId(null);
      setRevealedWord(null);
      setIsTimeout(false);
      setWrongAnswer(false);
      setAnswerBubbles([]);
      setState('playing');
      startLocalCountdown(timeMs);

      sendP2P({
        type: 'ROUND_START',
        round: roundNumber,
        totalRounds: total,
        timeMs,
        card: publicCard,
        players: playersRef.current,
      });

      // Schedule progressive hints if enabled
      if (roomConfigRef.current.progressiveHints) {
        // Hint 1 at 25% elapsed: reveal first letter
        const t1 = window.setTimeout(() => {
          if (stateRef.current !== 'playing') return;
          const nextMask = revealNextLetters(
            targetCard.word,
            currentMaskRef.current,
            1
          );
          currentMaskRef.current = nextMask;
          setWordMask(nextMask);
          sendP2P({ type: 'ROUND_HINT', wordMask: nextMask });
        }, Math.floor(timeMs * 0.25));

        // Hint 2 at 50% elapsed: unlock pronunciation audio + reveal 2nd letter
        const t2 = window.setTimeout(() => {
          if (stateRef.current !== 'playing') return;
          const nextMask = revealNextLetters(
            targetCard.word,
            currentMaskRef.current,
            1
          );
          currentMaskRef.current = nextMask;
          setWordMask(nextMask);
          setPhoneticsHint(targetCard.phonetics);
          soundManager.speakWord(
            targetCard.word,
            targetCard.phonetics[0]?.audio
          );
          sendP2P({
            type: 'ROUND_HINT',
            wordMask: nextMask,
            phonetics: targetCard.phonetics,
          });
        }, Math.floor(timeMs * 0.5));

        // Hint 3 at 75% elapsed: reveal another letter if word has >= 5 chars
        const t3 = window.setTimeout(() => {
          if (stateRef.current !== 'playing') return;
          if (targetCard.word.length >= 5) {
            const nextMask = revealNextLetters(
              targetCard.word,
              currentMaskRef.current,
              1
            );
            currentMaskRef.current = nextMask;
            setWordMask(nextMask);
            sendP2P({ type: 'ROUND_HINT', wordMask: nextMask });
          }
        }, Math.floor(timeMs * 0.75));

        hintTimersRef.current.push(t1, t2, t3);
      }

      // Schedule round timeout
      const timeoutTimer = window.setTimeout(() => {
        if (stateRef.current !== 'playing') return;
        clearAllGameTimers();

        matchHistoryRef.current.push({
          round: roundNumber,
          card: targetCard,
          winnerId: null,
        });

        setRoundWinnerId(null);
        setRevealedWord(targetCard.word);
        setFullRevealedCard(targetCard);
        setPhoneticsHint(targetCard.phonetics);
        setIsTimeout(true);
        setState('round-result');

        soundManager.speakWord(targetCard.word, targetCard.phonetics[0]?.audio);

        sendP2P({
          type: 'ROUND_RESULT',
          winnerId: null,
          word: targetCard.word,
          players: playersRef.current,
          isTimeout: true,
          card: targetCard,
        });

        nextRoundTimerRef.current = window.setTimeout(() => {
          if (roundIdx + 1 < battleCardsRef.current.length) {
            hostStartRound(roundIdx + 1);
          } else {
            hostFinishGame('all_rounds_done');
          }
        }, 3200);
      }, timeMs);

      hintTimersRef.current.push(timeoutTimer);

      // If playing against Bot, schedule Bot guesses
      if (isBotMatchRef.current) {
        const botPlayer = playersRef.current.find((p) => p.isBot);
        if (botPlayer) {
          // Bot makes a wrong guess around 30%-45% of the round 45% of the time
          if (Math.random() < 0.45) {
            const wrongDelay = Math.floor(
              timeMs * (0.25 + Math.random() * 0.2)
            );
            const btWrong = window.setTimeout(() => {
              if (stateRef.current !== 'playing') return;
              const wrongPool = [
                targetCard.word.slice(0, -1) + 'e',
                targetCard.word.slice(0, 2) + 'tion',
                'elaborate',
                'significant',
                'sustainable',
                'negotiate',
              ].filter((w) => w !== targetCard.word);
              const fakeGuess =
                wrongPool[Math.floor(Math.random() * wrongPool.length)] ||
                'thinking...';
              setAnswerBubbles((prev) => [
                ...prev,
                {
                  id: ++bubbleSeqRef.current,
                  answer: fakeGuess,
                  correct: false,
                  isOpponent: true,
                  playerName: botPlayer.displayName,
                },
              ]);
            }, wrongDelay);
            botTimersRef.current.push(btWrong);
          }

          // Bot solves the word between 45% and 88% of round time
          const solveDelay = Math.floor(timeMs * (0.45 + Math.random() * 0.42));
          const btSolve = window.setTimeout(() => {
            if (stateRef.current !== 'playing') return;
            handleHostEvaluateAnswer(
              targetCard.word,
              botPlayer.userId,
              botPlayer.displayName
            );
          }, solveDelay);
          botTimersRef.current.push(btSolve);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clearAllGameTimers, hostFinishGame, sendP2P, startLocalCountdown]
  );

  // Host-only: Evaluate an answer submitted by either Host or Guest (or Bot)
  const handleHostEvaluateAnswer = useCallback(
    (rawAnswer: string, playerId: string, playerName: string) => {
      if (stateRef.current !== 'playing') return;
      const targetCard = battleCardsRef.current[currentRoundIdxRef.current];
      if (!targetCard) return;

      const cleanGuess = rawAnswer.trim().toLowerCase();
      const cleanTarget = targetCard.word.trim().toLowerCase();
      const isCorrect = cleanGuess === cleanTarget;
      const isSelf = playerId === currentUserRef.current.userId;

      if (isCorrect) {
        clearAllGameTimers();
        const updatedPlayers = playersRef.current.map((p) =>
          p.userId === playerId ? { ...p, score: p.score + 1 } : p
        );
        playersRef.current = updatedPlayers;
        setPlayers(updatedPlayers);

        setAnswerBubbles((prev) => [
          ...prev,
          {
            id: ++bubbleSeqRef.current,
            answer: rawAnswer.trim(),
            correct: true,
            isOpponent: !isSelf,
            playerName,
          },
        ]);

        matchHistoryRef.current.push({
          round: currentRoundIdxRef.current + 1,
          card: targetCard,
          winnerId: playerId,
          timeTakenMs: Date.now() - roundStartTimeRef.current,
        });

        setRoundWinnerId(playerId);
        setRevealedWord(targetCard.word);
        setFullRevealedCard(targetCard);
        setPhoneticsHint(targetCard.phonetics);
        setIsTimeout(false);
        setState('round-result');

        if (isSelf) {
          soundManager.play('correct');
          window.setTimeout(() => {
            soundManager.speakWord(
              targetCard.word,
              targetCard.phonetics[0]?.audio
            );
          }, 400);
        } else {
          soundManager.speakWord(
            targetCard.word,
            targetCard.phonetics[0]?.audio
          );
        }

        sendP2P({
          type: 'OPPONENT_ANSWER',
          answer: rawAnswer.trim(),
          correct: true,
          playerId,
          playerName,
        });

        sendP2P({
          type: 'ROUND_RESULT',
          winnerId: playerId,
          word: targetCard.word,
          players: updatedPlayers,
          isTimeout: false,
          card: targetCard,
        });

        const nextIdx = currentRoundIdxRef.current + 1;
        nextRoundTimerRef.current = window.setTimeout(() => {
          if (nextIdx < battleCardsRef.current.length) {
            hostStartRound(nextIdx);
          } else {
            hostFinishGame('all_rounds_done');
          }
        }, 3200);
      } else {
        // Wrong answer
        if (isSelf) {
          soundManager.play('wrong');
          setWrongAnswer(true);
          window.setTimeout(() => setWrongAnswer(false), 600);
        } else {
          sendP2P({ type: 'WRONG_ANSWER', answer: rawAnswer.trim() });
        }

        setAnswerBubbles((prev) => [
          ...prev,
          {
            id: ++bubbleSeqRef.current,
            answer: rawAnswer.trim(),
            correct: false,
            isOpponent: !isSelf,
            playerName,
          },
        ]);

        sendP2P({
          type: 'OPPONENT_ANSWER',
          answer: rawAnswer.trim(),
          correct: false,
          playerId,
          playerName,
        });
      }
    },
    [clearAllGameTimers, hostFinishGame, hostStartRound, sendP2P]
  );

  // Host-only: Start the match
  const startMatch = useCallback(() => {
    if (!isHostRef.current) return;
    if (playersRef.current.length < 2) {
      setError('Cần đủ 2 người chơi trong phòng để bắt đầu!');
      return;
    }

    clearAllGameTimers();
    const cfg = roomConfigRef.current;
    const selectedCards = pickBattleCards(
      cfg.deckId,
      cfg.totalRounds,
      customCardsRef.current
    );
    battleCardsRef.current = selectedCards;
    matchHistoryRef.current = [];

    const resetPlayers = playersRef.current.map((p) => ({ ...p, score: 0 }));
    playersRef.current = resetPlayers;
    setPlayers(resetPlayers);
    setTotalRounds(cfg.totalRounds);
    setGameOverData(null);
    setRematchState('idle');
    setState('game-start');
    soundManager.play('notice');

    sendP2P({
      type: 'GAME_START',
      config: cfg,
      players: resetPlayers,
      totalRounds: cfg.totalRounds,
    });

    nextRoundTimerRef.current = window.setTimeout(() => {
      hostStartRound(0);
    }, 2400);
  }, [clearAllGameTimers, hostStartRound, sendP2P]);

  // Incoming P2P message handler for both Host and Guest
  const handleIncomingMessage = useCallback(
    (env: Envelope) => {
      if (!env || !env._msgId || !env.payload) return;
      if (seenMsgIdsRef.current.has(env._msgId)) return;
      seenMsgIdsRef.current.add(env._msgId);

      const msg = env.payload;

      switch (msg.type) {
        case 'PING': {
          sendP2P({ type: 'PONG', t: msg.t });
          break;
        }
        case 'PONG': {
          setPingMs(Math.max(1, Date.now() - msg.t));
          break;
        }
        case 'JOIN_REQUEST': {
          if (!isHostRef.current) return;
          if (
            !roomConfigRef.current.isPublic &&
            roomConfigRef.current.password &&
            msg.password !== roomConfigRef.current.password
          ) {
            sendP2P({
              type: 'JOIN_REJECTED',
              reason: 'Mật khẩu phòng không chính xác!',
            });
            return;
          }
          const hostPlayer: PlayerInfo = {
            userId: currentUserRef.current.userId,
            displayName: currentUserRef.current.displayName,
            avatar: currentUserRef.current.avatar,
            score: 0,
            isHost: true,
          };
          const guestPlayer: PlayerInfo = {
            ...msg.player,
            score: 0,
            isHost: false,
          };
          const updatedPlayers = [hostPlayer, guestPlayer];
          playersRef.current = updatedPlayers;
          setPlayers(updatedPlayers);
          setIsConnectedP2P(true);
          soundManager.play('notice');

          sendP2P({
            type: 'ROOM_SYNC',
            roomId: roomId || '',
            config: roomConfigRef.current,
            players: updatedPlayers,
            customCards:
              roomConfigRef.current.deckId === 'custom'
                ? customCardsRef.current
                : undefined,
          });
          break;
        }
        case 'JOIN_REJECTED': {
          setError(msg.reason);
          setIsConnecting(false);
          cleanupNetwork();
          setState('idle');
          break;
        }
        case 'ROOM_SYNC': {
          setIsConnecting(false);
          setIsConnectedP2P(true);
          setRoomConfig(msg.config);
          roomConfigRef.current = msg.config;
          setPlayers(msg.players);
          playersRef.current = msg.players;
          if (stateRef.current === 'idle') {
            setState('room-waiting');
            soundManager.play('notice');
          }
          break;
        }
        case 'GAME_START': {
          clearAllGameTimers();
          setRoomConfig(msg.config);
          roomConfigRef.current = msg.config;
          setPlayers(msg.players);
          playersRef.current = msg.players;
          setTotalRounds(msg.totalRounds);
          setGameOverData(null);
          setRematchState('idle');
          setState('game-start');
          soundManager.play('notice');
          break;
        }
        case 'ROUND_START': {
          clearAllGameTimers();
          setCurrentRound(msg.round);
          setTotalRounds(msg.totalRounds);
          setCard(msg.card);
          setFullRevealedCard(null);
          setWordMask(msg.card.wordMask);
          setPhoneticsHint(null);
          setPlayers(msg.players);
          playersRef.current = msg.players;
          setRoundWinnerId(null);
          setRevealedWord(null);
          setIsTimeout(false);
          setWrongAnswer(false);
          setAnswerBubbles([]);
          setState('playing');
          startLocalCountdown(msg.timeMs);
          break;
        }
        case 'ROUND_HINT': {
          if (msg.wordMask !== undefined) {
            setWordMask(msg.wordMask);
          }
          if (msg.phonetics !== undefined) {
            setPhoneticsHint(msg.phonetics);
            // Play audio hint when unlocked
            const audioUrl = msg.phonetics[0]?.audio;
            if (audioUrl) {
              soundManager.speakWord('', audioUrl);
            }
          }
          break;
        }
        case 'SUBMIT_ANSWER': {
          if (isHostRef.current) {
            handleHostEvaluateAnswer(
              msg.answer,
              msg.playerId,
              msg.playerName
            );
          }
          break;
        }
        case 'WRONG_ANSWER': {
          if (!isHostRef.current) {
            soundManager.play('wrong');
            setWrongAnswer(true);
            window.setTimeout(() => setWrongAnswer(false), 600);
          }
          break;
        }
        case 'OPPONENT_ANSWER': {
          const isSelf = msg.playerId === currentUserRef.current.userId;
          setAnswerBubbles((prev) => [
            ...prev,
            {
              id: ++bubbleSeqRef.current,
              answer: msg.answer,
              correct: msg.correct,
              isOpponent: !isSelf,
              playerName: msg.playerName,
            },
          ]);
          break;
        }
        case 'ROUND_RESULT': {
          clearAllGameTimers();
          setRoundWinnerId(msg.winnerId);
          setRevealedWord(msg.word);
          setFullRevealedCard(msg.card);
          setPhoneticsHint(msg.card.phonetics);
          setPlayers(msg.players);
          playersRef.current = msg.players;
          setIsTimeout(msg.isTimeout);
          setState('round-result');

          if (msg.winnerId === currentUserRef.current.userId) {
            soundManager.play('correct');
            window.setTimeout(() => {
              soundManager.speakWord(msg.word, msg.card.phonetics[0]?.audio);
            }, 400);
          } else {
            soundManager.speakWord(msg.word, msg.card.phonetics[0]?.audio);
          }
          break;
        }
        case 'GAME_OVER': {
          clearAllGameTimers();
          setGameOverData(msg.data);
          setPlayers(msg.data.players);
          playersRef.current = msg.data.players;
          setRematchState('idle');
          setState('game-over');
          soundManager.play('complete');

          // Update Guest stats
          const myPlayer = msg.data.players.find(
            (p) => p.userId === currentUserRef.current.userId
          );
          onStatsUpdate((prev) => ({
            totalGames: prev.totalGames + 1,
            totalWins:
              msg.data.winnerId === currentUserRef.current.userId
                ? prev.totalWins + 1
                : prev.totalWins,
            totalLosses:
              msg.data.loserId === currentUserRef.current.userId
                ? prev.totalLosses + 1
                : prev.totalLosses,
            totalDraws:
              msg.data.winnerId === null ? prev.totalDraws + 1 : prev.totalDraws,
            totalRoundsWon: prev.totalRoundsWon + (myPlayer?.score || 0),
          }));
          break;
        }
        case 'REMATCH_REQUEST': {
          if (rematchStateRef.current === 'waiting') {
            if (isHostRef.current) {
              startMatch();
            }
          } else {
            setRematchState('opponent_ready');
            soundManager.play('notice');
          }
          break;
        }
        case 'BACK_TO_ROOM': {
          clearAllGameTimers();
          setRoomConfig(msg.config);
          setPlayers(msg.players);
          setGameOverData(null);
          setRematchState('idle');
          setState('room-waiting');
          break;
        }
        case 'QUIT_MATCH': {
          if (isHostRef.current) {
            hostFinishGame('player_quit', msg.playerId);
          }
          break;
        }
      }
    },
    [
      cleanupNetwork,
      clearAllGameTimers,
      handleHostEvaluateAnswer,
      hostFinishGame,
      onStatsUpdate,
      roomId,
      sendP2P,
      startLocalCountdown,
      startMatch,
    ]
  );

  const handleIncomingRef = useRef(handleIncomingMessage);
  handleIncomingRef.current = handleIncomingMessage;

  const setupBroadcastChannel = useCallback((code: string) => {
    if (typeof BroadcastChannel === 'undefined') return;
    if (bcRef.current) {
      bcRef.current.close();
    }
    const bc = new BroadcastChannel(`${BC_PREFIX}${code}`);
    bc.onmessage = (ev) => {
      handleIncomingRef.current(ev.data as Envelope);
    };
    bcRef.current = bc;
  }, []);

  const startPingLoop = useCallback(() => {
    if (pingIntervalRef.current) {
      window.clearInterval(pingIntervalRef.current);
    }
    pingIntervalRef.current = window.setInterval(() => {
      sendP2P({ type: 'PING', t: Date.now() });
    }, 2500);
  }, [sendP2P]);

  // Create a P2P Room as Host
  const createRoom = useCallback(
    (initialConfig?: Partial<RoomConfig>) => {
      cleanupNetwork();
      setError(null);
      setIsConnecting(true);
      setIsBotMatch(false);

      const code = generateRoomCode();
      const mergedConfig: RoomConfig = {
        ...roomConfigRef.current,
        ...initialConfig,
      };
      setRoomConfig(mergedConfig);
      roomConfigRef.current = mergedConfig;
      setRoomId(code);
      setIsHost(true);
      isHostRef.current = true;

      const hostPlayer: PlayerInfo = {
        userId: currentUserRef.current.userId,
        displayName: currentUserRef.current.displayName,
        avatar: currentUserRef.current.avatar,
        score: 0,
        isHost: true,
      };
      setPlayers([hostPlayer]);
      playersRef.current = [hostPlayer];
      setState('room-waiting');

      // Setup BroadcastChannel for instant local/same-browser connection
      setupBroadcastChannel(code);

      // Setup PeerJS WebRTC Host
      const peer = new Peer(`${PEER_PREFIX}${code}`, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
          ],
        },
      });
      peerRef.current = peer;

      peer.on('open', () => {
        setIsConnecting(false);
      });

      peer.on('connection', (conn) => {
        connRef.current = conn;
        conn.on('open', () => {
          setIsConnectedP2P(true);
          startPingLoop();
        });
        conn.on('data', (data) => {
          handleIncomingRef.current(data as Envelope);
        });
        conn.on('close', () => {
          setIsConnectedP2P(false);
          if (
            stateRef.current === 'playing' ||
            stateRef.current === 'round-result' ||
            stateRef.current === 'game-start'
          ) {
            const guest = playersRef.current.find((p) => !p.isHost);
            if (guest) {
              hostFinishGame('player_disconnected', guest.userId);
            }
          } else if (stateRef.current === 'room-waiting') {
            const hostOnly = playersRef.current.filter((p) => p.isHost);
            setPlayers(hostOnly);
            playersRef.current = hostOnly;
          }
        });
      });

      peer.on('error', () => {
        // Even if PeerJS public broker has a hiccup, BroadcastChannel works locally
        setIsConnecting(false);
      });
    },
    [cleanupNetwork, hostFinishGame, setupBroadcastChannel, startPingLoop]
  );

  // Join an existing P2P Room as Guest
  const joinRoom = useCallback(
    (rawCode: string, password?: string) => {
      const code = rawCode.trim().toUpperCase();
      if (!code) return;

      cleanupNetwork();
      setError(null);
      setIsConnecting(true);
      setIsBotMatch(false);
      setRoomId(code);
      setIsHost(false);
      isHostRef.current = false;

      const guestPlayer: PlayerInfo = {
        userId: currentUserRef.current.userId,
        displayName: currentUserRef.current.displayName,
        avatar: currentUserRef.current.avatar,
        score: 0,
        isHost: false,
      };

      // 1. Setup BroadcastChannel fast-path (works immediately if on same browser)
      setupBroadcastChannel(code);
      window.setTimeout(() => {
        sendP2P({
          type: 'JOIN_REQUEST',
          player: guestPlayer,
          password,
        });
        startPingLoop();
      }, 80);

      // 2. Setup PeerJS WebRTC connection (works across any two devices/networks)
      const peer = new Peer({
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
          ],
        },
      });
      peerRef.current = peer;

      const connectTimeout = window.setTimeout(() => {
        if (stateRef.current === 'idle') {
          setIsConnecting(false);
          setError(
            `Không tìm thấy phòng "${code}" hoặc chủ phòng đã thoát. Vui lòng kiểm tra lại mã phòng!`
          );
          cleanupNetwork();
        }
      }, 9000);

      peer.on('open', () => {
        const conn = peer.connect(`${PEER_PREFIX}${code}`, {
          reliable: true,
        });
        connRef.current = conn;

        conn.on('open', () => {
          window.clearTimeout(connectTimeout);
          setIsConnectedP2P(true);
          sendP2P({
            type: 'JOIN_REQUEST',
            player: guestPlayer,
            password,
          });
          startPingLoop();
        });

        conn.on('data', (data) => {
          window.clearTimeout(connectTimeout);
          handleIncomingRef.current(data as Envelope);
        });

        conn.on('close', () => {
          setIsConnectedP2P(false);
          if (stateRef.current !== 'idle' && stateRef.current !== 'game-over') {
            setError('Chủ phòng đã ngắt kết nối.');
            cleanupNetwork();
            setState('idle');
          }
        });
      });

      peer.on('error', () => {
        // Wait for connectTimeout unless BroadcastChannel already succeeded
      });
    },
    [cleanupNetwork, sendP2P, setupBroadcastChannel, startPingLoop]
  );

  // Start a quick solo practice match against Parroto Bot
  const startBotMatch = useCallback(
    (overrideConfig?: Partial<RoomConfig>) => {
      cleanupNetwork();
      setError(null);
      const cfg: RoomConfig = {
        ...roomConfigRef.current,
        ...overrideConfig,
      };
      setRoomConfig(cfg);
      roomConfigRef.current = cfg;
      setIsHost(true);
      isHostRef.current = true;
      setIsBotMatch(true);
      isBotMatchRef.current = true;
      setIsConnectedP2P(true);
      setPingMs(1);
      setRoomId('BOT-SOLO');

      const humanPlayer: PlayerInfo = {
        userId: currentUserRef.current.userId,
        displayName: currentUserRef.current.displayName,
        avatar: currentUserRef.current.avatar,
        score: 0,
        isHost: true,
      };
      const botPlayer: PlayerInfo = {
        userId: 'parroto-bot-ai',
        displayName: 'Parroto Bot',
        avatar: '🦜',
        score: 0,
        isHost: false,
        isBot: true,
      };
      const matchPlayers = [humanPlayer, botPlayer];
      playersRef.current = matchPlayers;
      setPlayers(matchPlayers);

      const selectedCards = pickBattleCards(
        cfg.deckId,
        cfg.totalRounds,
        customCardsRef.current
      );
      battleCardsRef.current = selectedCards;
      matchHistoryRef.current = [];
      setTotalRounds(cfg.totalRounds);
      setGameOverData(null);
      setRematchState('idle');
      setState('game-start');
      soundManager.play('notice');

      nextRoundTimerRef.current = window.setTimeout(() => {
        hostStartRound(0);
      }, 2200);
    },
    [cleanupNetwork, hostStartRound]
  );

  // Update room configuration (Host only) and sync with Guest
  const updateRoomConfig = useCallback(
    (partial: Partial<RoomConfig>) => {
      const updated: RoomConfig = {
        ...roomConfigRef.current,
        ...partial,
      };
      setRoomConfig(updated);
      roomConfigRef.current = updated;

      if (isHostRef.current && roomId) {
        sendP2P({
          type: 'ROOM_SYNC',
          roomId,
          config: updated,
          players: playersRef.current,
          customCards:
            updated.deckId === 'custom' ? customCardsRef.current : undefined,
        });
      }
    },
    [roomId, sendP2P]
  );

  // Submit a word guess during a round
  const submitAnswer = useCallback(
    (rawAnswer: string) => {
      const trimmed = rawAnswer.trim();
      if (!trimmed || stateRef.current !== 'playing') return;

      if (isHostRef.current) {
        handleHostEvaluateAnswer(
          trimmed,
          currentUserRef.current.userId,
          currentUserRef.current.displayName
        );
      } else {
        sendP2P({
          type: 'SUBMIT_ANSWER',
          answer: trimmed,
          playerId: currentUserRef.current.userId,
          playerName: currentUserRef.current.displayName,
          timestamp: Date.now(),
        });
      }
    },
    [handleHostEvaluateAnswer, sendP2P]
  );

  // Request a rematch on Game Over screen
  const requestRematch = useCallback(() => {
    if (isBotMatchRef.current) {
      startBotMatch();
      return;
    }

    if (rematchStateRef.current === 'opponent_ready') {
      sendP2P({
        type: 'REMATCH_REQUEST',
        playerId: currentUserRef.current.userId,
      });
      if (isHostRef.current) {
        startMatch();
      }
    } else {
      setRematchState('waiting');
      sendP2P({
        type: 'REMATCH_REQUEST',
        playerId: currentUserRef.current.userId,
      });
    }
  }, [sendP2P, startBotMatch, startMatch]);

  // Return both players to the Waiting Room so Host can change deck/rounds
  const backToWaitingRoom = useCallback(() => {
    if (isBotMatchRef.current) {
      cleanupNetwork();
      setState('idle');
      return;
    }
    clearAllGameTimers();
    const resetPlayers = playersRef.current.map((p) => ({ ...p, score: 0 }));
    playersRef.current = resetPlayers;
    setPlayers(resetPlayers);
    setGameOverData(null);
    setRematchState('idle');
    setState('room-waiting');

    sendP2P({
      type: 'BACK_TO_ROOM',
      config: roomConfigRef.current,
      players: resetPlayers,
    });
  }, [cleanupNetwork, clearAllGameTimers, sendP2P]);

  // Quit active match
  const quitMatch = useCallback(() => {
    if (isBotMatchRef.current) {
      hostFinishGame('player_quit', currentUserRef.current.userId);
      return;
    }
    if (isHostRef.current) {
      hostFinishGame('player_quit', currentUserRef.current.userId);
    } else {
      sendP2P({ type: 'QUIT_MATCH', playerId: currentUserRef.current.userId });
    }
  }, [hostFinishGame, sendP2P]);

  // Leave room completely back to Lobby
  const leaveRoom = useCallback(() => {
    cleanupNetwork();
    setRoomId(null);
    setIsHost(false);
    setIsBotMatch(false);
    setPlayers([]);
    setGameOverData(null);
    setRematchState('idle');
    setState('idle');
  }, [cleanupNetwork]);

  useEffect(() => {
    return () => {
      cleanupNetwork();
    };
  }, [cleanupNetwork]);

  const opponent =
    players.find((p) => p.userId !== currentUser.userId) || null;

  return {
    state,
    isConnecting,
    isConnectedP2P,
    pingMs,
    error,
    clearError: () => setError(null),
    roomId,
    isHost,
    isBotMatch,
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
  };
}
