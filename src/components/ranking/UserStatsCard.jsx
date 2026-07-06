import { formatNumber } from '../../utils/formatters';
import './UserStatsCard.css';

export function UserStatsCard({ userName, stats, games }) {
  return (
    <div className="user-stats-card">
      <h3 className="user-stats-card__name">{userName}</h3>
      <p className="user-stats-card__subtitle">Sua melhor pontuação em cada jogo</p>

      <div className="user-stats-card__games">
        {games.map((game) => {
          const gameStats = stats?.subjects?.[game.id];
          return (
            <div key={game.id} className="user-stats-card__game">
              <span className="user-stats-card__game-value">
                {formatNumber(gameStats?.bestScore ?? 0)}
                {gameStats?.bestScoreComplete === false && (
                  <span
                    className="user-stats-card__game-partial"
                    title="Melhor pontuação com seleção parcial de tabuadas"
                  >
                    parcial
                  </span>
                )}
              </span>
              <span className="user-stats-card__game-label">{game.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
