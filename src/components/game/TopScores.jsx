import { getGlobalRanking } from '../../services/scoreService';
import { useUser } from '../../hooks/useUser';
import { formatNumber, formatDate } from '../../utils/formatters';
import './TopScores.css';

const MEDALS = ['🥇', '🥈', '🥉'];

export function TopScores({ subjectId, unit = 'pts' }) {
  const { userName } = useUser();
  // Read fresh each render — the idle screen is not performance-sensitive and this
  // avoids showing a stale board after the ranking changes.
  const top = getGlobalRanking(subjectId).slice(0, 3);

  return (
    <div className="top-scores">
      <h2 className="top-scores__title">Pontuações a bater</h2>
      {top.length === 0 ? (
        <p className="top-scores__empty">Ninguém pontuou ainda. Seja o primeiro!</p>
      ) : (
        <ol className="top-scores__list">
          {top.map((entry, index) => (
            <li
              key={entry.name}
              className={`top-scores__row ${entry.name === userName ? 'top-scores__row--me' : ''}`}
            >
              <span className="top-scores__medal">{MEDALS[index]}</span>
              <div className="top-scores__player">
                <span className="top-scores__name">{entry.name}</span>
                {entry.achievedAt && (
                  <span className="top-scores__date">{formatDate(entry.achievedAt)}</span>
                )}
              </div>
              <span className="top-scores__score">
                {formatNumber(entry.score)} {unit}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
