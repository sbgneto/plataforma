function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Números disponíveis para treino de tabuada (0 a 9).
export const TABLE_NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// Combinações das tabuadas escolhidas: cada número selecionado multiplicado
// por 0 a 9 (10 perguntas por tabuada; seleção completa = 100 combinações).
function allCombos(numbers = TABLE_NUMBERS) {
  const combos = [];
  for (const a of numbers) {
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

export function generateQuestions(count = 10, numbers = TABLE_NUMBERS) {
  return shuffle(allCombos(numbers)).slice(0, count).map(buildQuestion);
}

// Todas as combinações das tabuadas escolhidas em ordem aleatória, uma por
// pergunta (seleção completa = 100 perguntas).
export function generateAllQuestions(numbers = TABLE_NUMBERS) {
  return shuffle(allCombos(numbers)).map(buildQuestion);
}
