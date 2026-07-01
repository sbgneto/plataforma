import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../hooks/useUser';
import { SubjectCard } from '../components/home/SubjectCard';
import { MATH_GAMES } from '../constants/mathGames';
import './MathMenuPage.css';

export function MathMenuPage() {
  const { hasUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasUser) navigate('/');
  }, [hasUser, navigate]);

  if (!hasUser) return null;

  return (
    <div className="math-menu">
      <motion.div
        className="math-menu__intro"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="math-menu__eyebrow">Matemática</span>
        <h1 className="math-menu__title">Escolha um jogo</h1>
      </motion.div>

      <div className="math-menu__grid">
        {MATH_GAMES.map((game) => (
          <SubjectCard key={game.id} subject={game} locked={false} />
        ))}
      </div>
    </div>
  );
}
