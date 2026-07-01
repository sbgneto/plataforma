import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import './SubjectCard.css';

export function SubjectCard({ subject, locked = false, onBlockedClick }) {
  const navigate = useNavigate();
  const { label, description, color, colorBg, icon, enabled, route } = subject;
  const isClickable = enabled && !locked;

  const handleClick = () => {
    if (isClickable) {
      navigate(route);
      return;
    }
    onBlockedClick?.(subject);
  };

  return (
    <motion.button
      type="button"
      className={`subject-card ${!enabled ? 'subject-card--disabled' : ''}`}
      style={{ '--card-color': color, '--card-color-bg': colorBg }}
      onClick={handleClick}
      whileHover={isClickable ? { y: -6 } : {}}
      whileTap={isClickable ? { scale: 0.97 } : {}}
    >
      <span className="subject-card__icon">{icon}</span>
      <span className="subject-card__label">{label}</span>
      {description && <span className="subject-card__description">{description}</span>}
      {!enabled && <Badge>Em breve</Badge>}
    </motion.button>
  );
}
