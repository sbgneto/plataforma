import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useUser } from '../hooks/useUser';
import { NameInput } from '../components/home/NameInput';
import { SubjectCard } from '../components/home/SubjectCard';
import { SUBJECTS, RANKING_SUBJECT } from '../constants/subjects';
import { sanitizeName } from '../utils/validators';
import './HomePage.css';

export function HomePage() {
  const { userName, setUserName, hasUser } = useUser();
  const [warning, setWarning] = useState('');
  const navigate = useNavigate();

  const handleNameChange = (value) => {
    setWarning('');
    setUserName(sanitizeName(value));
  };

  const handleBlockedClick = (subject) => {
    if (!subject.enabled) return;
    if (!hasUser) {
      setWarning('Digite seu nome antes de começar a jogar.');
    }
  };

  const rankingCard = {
    ...RANKING_SUBJECT,
    description: 'Veja sua posição',
    enabled: true,
  };

  return (
    <div className="home-page">
      <motion.div
        className="home-page__intro"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="home-page__title">Aprenda jogando</h1>
        <p className="home-page__subtitle">
          Escolha uma matéria, dispute pontos e suba no ranking.
        </p>
      </motion.div>

      <NameInput value={userName} onChange={handleNameChange} />

      <AnimatePresence>
        {warning && (
          <motion.p
            className="home-page__warning"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {warning}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="home-page__grid">
        {SUBJECTS.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            locked={!hasUser}
            onBlockedClick={handleBlockedClick}
          />
        ))}
        <SubjectCard
          subject={rankingCard}
          locked={false}
          onBlockedClick={() => navigate(RANKING_SUBJECT.route)}
        />
      </div>
    </div>
  );
}
