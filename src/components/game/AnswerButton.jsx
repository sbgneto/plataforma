import { motion } from 'framer-motion';
import './AnswerButton.css';

const shakeAnimation = {
  x: [0, -8, 8, -6, 6, 0],
  transition: { duration: 0.4 },
};

export function AnswerButton({ value, status, onClick }) {
  const isDisabled = status !== 'idle';

  return (
    <motion.button
      type="button"
      className={`answer-btn answer-btn--${status}`}
      onClick={() => !isDisabled && onClick(value)}
      whileHover={!isDisabled ? { scale: 1.03 } : {}}
      whileTap={!isDisabled ? { scale: 0.96 } : {}}
      animate={status === 'wrong' ? shakeAnimation : { scale: status === 'correct' ? 1.05 : 1 }}
      disabled={isDisabled}
    >
      {value}
    </motion.button>
  );
}
