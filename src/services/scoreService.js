import { getItem, setItem } from './storageService';
import { STORAGE_KEYS, SCHEMA_VERSION } from '../constants/storageKeys';
import { SUBJECTS } from '../constants/subjects';

const MAX_HISTORY_ENTRIES = 20;

function emptySubjectStats() {
  return { bestScore: 0, gamesPlayed: 0, history: [] };
}

function emptyUser(name) {
  const subjects = {};
  SUBJECTS.forEach((subject) => {
    subjects[subject.id] = emptySubjectStats();
  });
  return {
    name,
    createdAt: new Date().toISOString(),
    subjects,
  };
}

function readScores() {
  return getItem(STORAGE_KEYS.SCORES, { version: SCHEMA_VERSION, users: {} });
}

function writeScores(data) {
  setItem(STORAGE_KEYS.SCORES, data);
}

export function recordGameResult(userName, subjectId, result) {
  const data = readScores();
  if (!data.users[userName]) {
    data.users[userName] = emptyUser(userName);
  }
  const user = data.users[userName];
  if (!user.subjects[subjectId]) {
    user.subjects[subjectId] = emptySubjectStats();
  }
  const subject = user.subjects[subjectId];

  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    score: result.score,
    correctAnswers: result.correctAnswers,
    totalQuestions: result.totalQuestions,
    maxCombo: result.maxCombo,
    durationMs: result.durationMs,
    playedAt: new Date().toISOString(),
  };

  subject.history = [entry, ...subject.history].slice(0, MAX_HISTORY_ENTRIES);
  subject.gamesPlayed += 1;
  // Only the best (maximum) score per game is kept for the ranking — never a sum.
  subject.bestScore = Math.max(subject.bestScore, result.score);

  writeScores(data);

  return { user, entry };
}

export function getUserStats(userName) {
  if (!userName) return null;
  const data = readScores();
  return data.users[userName] ?? null;
}

// Ranking of every user by their best (max) score in a single game.
export function getGlobalRanking(subjectId) {
  if (!subjectId) return [];
  const data = readScores();

  return Object.values(data.users)
    .map((user) => ({
      name: user.name,
      score: user.subjects[subjectId]?.bestScore ?? 0,
      gamesPlayed: user.subjects[subjectId]?.gamesPlayed ?? 0,
    }))
    .filter((entry) => entry.gamesPlayed > 0)
    .sort((a, b) => b.score - a.score);
}
