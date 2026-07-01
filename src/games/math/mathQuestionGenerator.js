function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function allCombos() {
  const combos = [];
  for (let a = 0; a <= 9; a += 1) {
    for (let b = 0; b <= 9; b += 1) {
      combos.push([a, b]);
    }
  }
  return combos;
}

function generateDistractors(correctAnswer, a, b) {
  const candidates = new Set();
  const nearby = [
    correctAnswer + a,
    correctAnswer - a,
    correctAnswer + b,
    correctAnswer - b,
    correctAnswer + 1,
    correctAnswer - 1,
    correctAnswer + 2,
    correctAnswer - 2,
    a * (b + 1),
    a * (b - 1),
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

function buildQuestion([a, b], index) {
  const correctAnswer = a * b;
  const distractors = generateDistractors(correctAnswer, a, b);
  const options = shuffle([correctAnswer, ...distractors]);

  return {
    id: `${index}-${a}x${b}`,
    a,
    b,
    correctAnswer,
    options,
  };
}

export function generateQuestions(count = 10) {
  return shuffle(allCombos()).slice(0, count).map(buildQuestion);
}

// Every combination 0-9 × 0-9 (100 questions) in random order, one per question.
export function generateAllQuestions() {
  return shuffle(allCombos()).map(buildQuestion);
}
