import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { MATH_GAMES } from '../constants/mathGames';

// Ranking compartilhado no Firestore. Estrutura:
//   games/{subjectId}/scores/{docId}  ->  { name, bestScore, bestScoreAt, gamesPlayed, updatedAt }
// Guarda só a MELHOR (máxima) pontuação de cada usuário por jogo — nunca a soma.

const RANKING_LIMIT = 50;

function scoresCollection(subjectId) {
  return collection(db, 'games', subjectId, 'scores');
}

// Nome vira id do documento; remove barras (proibidas em ids) e limita o tamanho.
function safeDocId(name) {
  return (name ?? '').trim().replace(/\//g, '_').slice(0, 60) || 'anon';
}

function emptySubjectStats() {
  return { bestScore: 0, bestScoreAt: null, gamesPlayed: 0 };
}

export async function recordGameResult(userName, subjectId, result) {
  const ref = doc(db, 'games', subjectId, 'scores', safeDocId(userName));
  const snap = await getDoc(ref);
  const prev = snap.exists() ? snap.data() : null;

  const previousBest = prev?.bestScore ?? -1;
  const isNewBest = result.score > previousBest;
  const now = new Date().toISOString();

  const data = {
    name: userName,
    bestScore: isNewBest ? result.score : prev.bestScore,
    bestScoreAt: isNewBest ? now : (prev?.bestScoreAt ?? now),
    gamesPlayed: (prev?.gamesPlayed ?? 0) + 1,
    updatedAt: now,
  };

  await setDoc(ref, data);
  return { isNewBest, bestScore: data.bestScore };
}

// Estatísticas do usuário atual em cada jogo (mesma forma que o UserStatsCard espera).
export async function getUserStats(userName) {
  if (!userName) return null;
  const id = safeDocId(userName);

  const subjects = {};
  await Promise.all(
    MATH_GAMES.map(async (game) => {
      const snap = await getDoc(doc(db, 'games', game.id, 'scores', id));
      subjects[game.id] = snap.exists()
        ? {
            bestScore: snap.data().bestScore ?? 0,
            bestScoreAt: snap.data().bestScoreAt ?? null,
            gamesPlayed: snap.data().gamesPlayed ?? 0,
          }
        : emptySubjectStats();
    }),
  );

  return { name: userName, subjects };
}

// Ranking de todos os usuários por melhor pontuação num jogo.
export async function getGlobalRanking(subjectId) {
  if (!subjectId) return [];
  const q = query(scoresCollection(subjectId), orderBy('bestScore', 'desc'), limit(RANKING_LIMIT));
  const snap = await getDocs(q);

  return snap.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      name: data.name,
      score: data.bestScore ?? 0,
      gamesPlayed: data.gamesPlayed ?? 0,
      achievedAt: data.bestScoreAt ?? null,
    };
  });
}
