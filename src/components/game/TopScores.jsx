import { useEffect, useState } from 'react';
import { getGlobalRanking } from '../../services/scoreService';
import { useUser } from '../../hooks/useUser';
import { formatNumber, formatDate } from '../../utils/formatters';
import './TopScores.css';

const MEDALS = ['🥇', '🥈', '🥉'];

export function TopScores({ subjectId, unit = 'pts' }) {
  const { userName } = useUser();
  const [top, setTop] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getGlobalRanking(subjectId)
      .then((data) => {
        if (!active) return;
        setTop(data.slice(0, 3));
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setTop([]);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [subjectId]);

  return (
    <div className="top-scores">
      <h2 className="top-scores__title">Pontuações a bater</h2>
      {loading ? (
        <p className="top-scores__empty">Carregando…</p>
      ) : top.length === 0 ? (
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
