import { motion } from 'framer-motion';
import './ProgressTimer.css';

export function ProgressTimer({ timeLeftMs, durationMs }) {
  const ratio = Math.max(0, Math.min(1, timeLeftMs / durationMs));
  const color = ratio > 0.5 ? 'var(--color-success)' : ratio > 0.25 ? '#f59e0b' : 'var(--color-error)';

  return (
    <div className="progress-timer">
      <motion.div
        className="progress-timer__bar"
        animate={{ width: `${ratio * 100}%`, backgroundColor: color }}
        transition={{ duration: 0.1, ease: 'linear' }}
      />
    </div>
  );
}
