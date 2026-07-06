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

function buildOperands(operator) {
  if (operator === '+') {
    return [randomInt(1, 50), randomInt(1, 50)];
  }
  // Subtraction keeps a >= b so the result is never negative.
  const a = randomInt(1, 50);
  const b = randomInt(0, a);
  return [a, b];
}

function generateDistractors(correctAnswer, a, b, operator) {
  const candidates = new Set();
  const swappedOperation = operator === '+' ? Math.abs(a - b) : a + b;
  const nearby = [
    correctAnswer + 1,
    correctAnswer - 1,
    correctAnswer + 2,
    correctAnswer - 2,
    correctAnswer + 10,
    correctAnswer - 10,
    swappedOperation,
  ];

  nearby.forEach((value) => {
    if (value >= 0 && value !== correctAnswer) candidates.add(value);
  });

  let fallback = 3;
  while (candidates.size < 3) {
    const value = correctAnswer + fallback;
    if (value !== correctAnswer && value >= 0) candidates.add(value);
    fallback += 1;
  }

  return shuffle([...candidates]).slice(0, 3);
}

function buildQuestion(index) {
  const operator = Math.random() < 0.5 ? '+' : '-';
  const [a, b] = buildOperands(operator);
  const correctAnswer = operator === '+' ? a + b : a - b;
  const distractors = generateDistractors(correctAnswer, a, b, operator);
  const options = shuffle([correctAnswer, ...distractors]);

  return {
    id: `${index}-${a}${operator}${b}`,
    a,
    b,
    operator,
    correctAnswer,
    options,
  };
}

export function generateQuestions(count = 10) {
  const questions = [];
  const seen = new Set();

  while (questions.length < count) {
    const question = buildQuestion(questions.length);
    const key = `${question.a}${question.operator}${question.b}`;
    if (seen.has(key)) continue;
    seen.add(key);
    questions.push(question);
  }

  return questions;
}
