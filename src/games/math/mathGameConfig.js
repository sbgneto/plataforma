export const QUESTIONS_PER_GAME = 10;
export const TIME_PER_QUESTION_MS = 10000;
export const BASE_POINTS = 100;
export const SPEED_BONUS_MAX = 50;
// Answering with at least this much time left earns the full speed bonus, so a
// fast player can reliably reach the maximum (100) — no need to be instant.
export const SPEED_FULL_MS = 6000;
export const COMBO_BONUS_PER_STEP = 10;
export const COMBO_THRESHOLD = 3;
export const FEEDBACK_DELAY_MS = 900;
export const MAX_SCORE = 100;

export function calculatePoints({ correct, timeLeftMs, combo }) {
  if (!correct) return 0;
  const basePoints = BASE_POINTS;
  const speedRatio = Math.min(1, timeLeftMs / SPEED_FULL_MS);
  const speedBonus = Math.round(speedRatio * SPEED_BONUS_MAX);
  const comboBonus = combo >= COMBO_THRESHOLD ? (combo - (COMBO_THRESHOLD - 1)) * COMBO_BONUS_PER_STEP : 0;
  return basePoints + speedBonus + comboBonus;
}

// Raw points of a flawless run: every answer correct, full speed, unbroken combo.
// Used to normalize the accumulated score onto a 0–100 scale.
function perfectRunRaw() {
  let raw = 0;
  for (let i = 0; i < QUESTIONS_PER_GAME; i += 1) {
    raw += calculatePoints({ correct: true, timeLeftMs: TIME_PER_QUESTION_MS, combo: i });
  }
  return raw;
}

const RAW_MAX_PER_GAME = perfectRunRaw();

// Convert an accumulated raw total into the 0–100 score shown to the player.
export function normalizeScore(rawTotal) {
  if (RAW_MAX_PER_GAME === 0) return 0;
  return Math.min(MAX_SCORE, Math.round((rawTotal / RAW_MAX_PER_GAME) * MAX_SCORE));
}
