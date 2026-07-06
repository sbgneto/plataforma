import './NumberPicker.css';

// Seletor das tabuadas que entram na partida. Sempre mantém ao menos um
// número selecionado; com todos marcados a partida conta como "completa".
export function NumberPicker({ numbers, selected, onChange }) {
  const allSelected = selected.length === numbers.length;

  function toggle(n) {
    if (selected.includes(n)) {
      if (selected.length === 1) return;
      onChange(selected.filter((value) => value !== n));
    } else {
      onChange([...selected, n].sort((a, b) => a - b));
    }
  }

  return (
    <div className="number-picker">
      <p className="number-picker__label">Escolha as tabuadas do treino</p>
      <div className="number-picker__grid">
        {numbers.map((n) => (
          <button
            key={n}
            type="button"
            className={`number-picker__chip ${selected.includes(n) ? 'number-picker__chip--on' : ''}`}
            aria-pressed={selected.includes(n)}
            onClick={() => toggle(n)}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          className="number-picker__all"
          onClick={() => onChange([...numbers])}
          disabled={allSelected}
        >
          Todas
        </button>
      </div>
      {!allSelected && (
        <p className="number-picker__hint">
          Treino parcial — a pontuação aparece marcada como parcial no ranking.
        </p>
      )}
    </div>
  );
}
