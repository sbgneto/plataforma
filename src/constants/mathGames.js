// Registry of the games inside the "Matemática" subject. Each game's `id` is also
// the scoring key used by scoreService, so every game gets its own ranking.
export const MATH_GAMES = [
  {
    id: 'math',
    label: 'Tabuada 0 a 9',
    description: '10 perguntas · pontos por velocidade e combo',
    route: '/matematica/tabuada',
    color: 'var(--color-math)',
    colorBg: 'var(--color-math-bg)',
    icon: '✕',
    enabled: true,
  },
  {
    id: 'math_completa',
    label: 'Tabuada Completa',
    description: '100 perguntas em 100 segundos',
    route: '/matematica/tabuada-completa',
    color: 'var(--color-math)',
    colorBg: 'var(--color-math-bg)',
    icon: '⚡',
    enabled: true,
  },
  {
    id: 'math_soma_subtracao',
    label: 'Soma e Subtração',
    description: '10 perguntas · pontos por velocidade e combo',
    route: '/matematica/soma-subtracao',
    color: 'var(--color-math)',
    colorBg: 'var(--color-math-bg)',
    icon: '±',
    enabled: true,
  },
];
