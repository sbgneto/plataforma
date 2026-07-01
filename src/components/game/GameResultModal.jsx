import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { formatNumber } from '../../utils/formatters';
import './GameResultModal.css';

export function GameResultModal({
  score,
  scoreUnit = 'pontos',
  stats = [],
  isNewBest,
  onPlayAgain,
  onViewRanking,
  onGoHome,
}) {
  return (
    <motion.div
      className="result-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="result-modal"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <h2 className="result-modal__title">
          {isNewBest ? 'Novo recorde!' : 'Partida concluída!'}
        </h2>

        <div className="result-modal__score">{formatNumber(score)}</div>
        <p className="result-modal__subtitle">{scoreUnit}</p>

        <div className="result-modal__stats">
          {stats.map((stat) => (
            <div key={stat.label}>
              <span className="result-modal__stat-value">{stat.value}</span>
              <span className="result-modal__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="result-modal__actions">
          <Button variant="primary" onClick={onPlayAgain}>
            Jogar novamente
          </Button>
          <Button variant="secondary" onClick={onViewRanking}>
            Ver ranking
          </Button>
          <Button variant="ghost" onClick={onGoHome}>
            Voltar à home
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
