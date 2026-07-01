import { motion } from 'framer-motion';
import { formatNumber } from '../../utils/formatters';
import './ScoreHUD.css';

export function ScoreHUD({ score, combo, questionNumber, totalQuestions }) {
  return (
    <div className="score-hud">
      <div className="score-hud__item">
        <span className="score-hud__label">Pergunta</span>
        <span className="score-hud__value">
          {questionNumber}/{totalQuestions}
        </span>
      </div>
      <div className="score-hud__item">
        <span className="score-hud__label">Pontos</span>
        <motion.span
          key={score}
          className="score-hud__value score-hud__value--score"
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          {formatNumber(score)}
        </motion.span>
      </div>
      <div className="score-hud__item">
        <span className="score-hud__label">Combo</span>
        <span className="score-hud__value">{combo > 0 ? `x${combo}` : '-'}</span>
      </div>
    </div>
  );
}
