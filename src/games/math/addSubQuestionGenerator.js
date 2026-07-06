// Gerador de perguntas de soma e subtração. Operandos de 1 a 20; subtrações
// nunca têm resultado negativo (o maior número vem sempre primeiro).
const MIN_OPERAND = 1;
const MAX_OPERAND = 20;

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function generateDistractors(correctAnswer, a, b) {
  const candidates = new Set();
  const nearby = [
    correctAnswer + 1,
    correctAnswer - 1,
    correctAnswer + 2,
    correctAnswer - 2,
    correctAnswer + 10,
    correctAnswer - 10,
    a,
    b,
    a + b,
    Math.abs(a - b),
  ];

  nearby.forEach((value) => {
    if (value >= 0 && value !== correctAnswer) candidates.add(value);
  });

  let fallback = 1;
  while (candidates.size < 3) {
    const value = correctAnswer + fallback;
    if (value !== correctAnswer && value >= 0) candidates.add(value);
    fallback += 1;
  }

  return shuffle([...candidates]).slice(0, 3);
}

function buildQuestion(index, usedKeys) {
  // Tenta até achar uma pergunta inédita nesta partida (o espaço de combinações
  // é bem maior que o número de perguntas, então isso termina rápido).
  for (;;) {
    const operator = Math.random() < 0.5 ? '+' : '−';
    let a = randomInt(MIN_OPERAND, MAX_OPERAND);
    let b = randomInt(MIN_OPERAND, MAX_OPERAND);
    if (operator === '−' && b > a) [a, b] = [b, a];

    const key = `${a}${operator}${b}`;
    if (usedKeys.has(key)) continue;
    usedKeys.add(key);

    const correctAnswer = operator === '+' ? a + b : a - b;
    const distractors = generateDistractors(correctAnswer, a, b);
    const options = shuffle([correctAnswer, ...distractors]);

    return {
      id: `${index}-${key}`,
      a,
      b,
      operator,
      correctAnswer,
      options,
    };
  }
}

export function generateAddSubQuestions(count = 10) {
  const usedKeys = new Set();
  return Array.from({ length: count }, (_, index) => buildQuestion(index, usedKeys));
}
