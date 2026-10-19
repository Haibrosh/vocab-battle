import { VocabCard } from '../types/game';

const PARROTO_AES_KEY_B64 = 'ECJe1m62IPoNYovN/BiSXd5Xu6r1nrV86MZ0zCoX8To=';
const API_BASE = 'https://api.parroto.app/api';

let cachedCryptoKey: CryptoKey | null = null;

async function getCryptoKey(): Promise<CryptoKey> {
  if (cachedCryptoKey) return cachedCryptoKey;
  const rawKey = Uint8Array.from(atob(PARROTO_AES_KEY_B64), (c) =>
    c.charCodeAt(0)
  );
  cachedCryptoKey = await window.crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );
  return cachedCryptoKey;
}

export async function decryptParrotoPayload<T = any>(
  encryptedBase64: string
): Promise<T> {
  const key = await getCryptoKey();
  const bytes = Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0));
  const iv = bytes.slice(0, 12);
  const ciphertextWithTag = bytes.slice(12);
  const decryptedBuf = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    ciphertextWithTag
  );
  const jsonStr = new TextDecoder().decode(decryptedBuf);
  return JSON.parse(jsonStr);
}

export interface ParrotoCommunityDeck {
  _id: string;
  name: string;
  description?: string;
  total_cards: number;
  total_groups: number;
  study_count: number;
  author?: {
    display_name?: string;
    username?: string;
  };
}

export async function searchParrotoCommunityDecks(
  search = '',
  page = 1,
  limit = 24
): Promise<{ decks: ParrotoCommunityDeck[]; total: number }> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search.trim()) {
    params.set('search', search.trim());
  }
  const res = await fetch(
    `${API_BASE}/vocabulary/enc/public/user-published?${params.toString()}`
  );
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const raw = await res.json();
  const decoded = raw.encrypted ? await decryptParrotoPayload(raw.data) : raw;
  const decks: ParrotoCommunityDeck[] = (decoded?.data?.decks || []).filter(
    (d: ParrotoCommunityDeck) => d.total_cards >= 5
  );
  return {
    decks,
    total: decoded?.data?.total || decks.length,
  };
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function maskWordInText(text: string, word: string, maskStr: string): string {
  if (!text || !word) return text || '';
  const cleanWord = word.trim();
  const regex = new RegExp(`\\b${escapeRegex(cleanWord)}[a-z]*\\b`, 'gi');
  return text.replace(regex, maskStr);
}

export async function fetchParrotoDeckCards(
  deckId: string
): Promise<VocabCard[]> {
  const gRes = await fetch(
    `${API_BASE}/vocabulary/enc/public/${deckId}/groups`
  );
  if (!gRes.ok) throw new Error(`HTTP ${gRes.status}`);
  const gJson = await gRes.json();
  const gDecoded = gJson.encrypted
    ? await decryptParrotoPayload(gJson.data)
    : gJson;
  const groups = gDecoded?.data || [];

  const cards: VocabCard[] = [];
  const seen = new Set<string>();

  await Promise.all(
    groups.slice(0, 25).map(async (g: any) => {
      const gId = g._id || g.group_id;
      const cRes = await fetch(
        `${API_BASE}/vocabulary/enc/public/${deckId}/groups/${gId}/cards?page=1&limit=300`
      );
      if (!cRes.ok) return;
      const cJson = await cRes.json();
      const cDecoded = cJson.encrypted
        ? await decryptParrotoPayload(cJson.data)
        : cJson;
      const rawCards = cDecoded?.data?.cards || cDecoded?.data || [];

      for (const raw of rawCards) {
        let word = (raw.word || '').trim().replace(/\s*\(.*?\)\s*/g, '').trim();
        if (!word || word.length < 2 || word.length > 26) continue;
        if (!/^[a-zA-Z][a-zA-Z\s-]*[a-zA-Z]$/.test(word)) continue;
        const lowerKey = word.toLowerCase();
        if (seen.has(lowerKey)) continue;

        const transVi = (
          raw.translation?.vi ||
          raw.translation?.en ||
          ''
        ).trim();
        if (!transVi) continue;

        seen.add(lowerKey);
        const expVi = (
          raw.explanation?.vi ||
          raw.explanation?.en ||
          `Từ vựng mang nghĩa "${transVi}"`
        ).trim();
        const expEn = (raw.explanation?.en || expVi).trim();
        const exEn = (raw.example?.en || '').trim();
        const exVi = (raw.example?.vi || '').trim();

        const starMask = '*'.repeat(Math.max(4, word.length));
        let maskedExEn = exEn
          ? maskWordInText(exEn, word, starMask)
          : `Can you use the word ${starMask} in a sentence?`;
        if (!maskedExEn.includes('*')) {
          maskedExEn = `${maskedExEn} (${starMask})`;
        }

        const pRaw = Array.isArray(raw.phonetics) ? raw.phonetics : [];
        const usP = pRaw.find((p: any) => p.locale === 'en-US') || pRaw[0];
        cards.push({
          cardId: raw._id || `comm-${deckId}-${lowerKey}`,
          word,
          type: 'noun',
          deckId: 'custom',
          level: 'B2',
          ...(raw.image_url ? { imageUrl: raw.image_url } : {}),
          phonetics: [
            {
              locale: 'en-US',
              text: usP?.text ? usP.text.replace(/^\/|\/$/g, '') : word,
              audio:
                usP?.audio ||
                `https://api.dictionaryapi.dev/media/pronunciations/en/${encodeURIComponent(lowerKey)}-us.mp3`,
            },
          ],
          translation: {
            vi: maskWordInText(transVi, word, '...'),
            en: maskWordInText(expEn, word, '...'),
          },
          explanation: {
            vi: maskWordInText(expVi, word, '...'),
            en: maskWordInText(expEn, word, '...'),
          },
          exampleMasked: {
            en: maskedExEn,
            vi: exVi,
          },
        });
      }
    })
  );

  return cards;
}
