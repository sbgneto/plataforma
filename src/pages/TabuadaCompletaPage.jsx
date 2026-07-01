import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../hooks/useUser';
import { useSound } from '../hooks/useSound';
import { useGameTimer } from '../hooks/useGameTimer';
import { generateAllQuestions } from '../games/math/mathQuestionGenerator';
import { TOTAL_QUESTIONS, TOTAL_TIME_MS } from '../games/math/tabuadaCompletaConfig';
import { recordGameResult } from '../services/scoreService';
import { QuestionCard } from '../components/game/QuestionCard';
import { ProgressTimer } from '../components/game/ProgressTimer';
import { GameResultModal } from '../components/game/GameResultModal';
import { TopScores } from '../components/game/TopScores';
import { Button } from '../components/ui/Button';
import './TabuadaCompletaPage.css';

const GAME_ID = 'math_completa';

export function TabuadaCompletaPage() {
  const { userName, hasUser } = useUser();
  const navigate = useNavigate();
  const sound = useSound();

  const [gameState, setGameState] = useState('idle');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [result, setResult] = useState(null);
  const [isNewBest, setIsNewBest] = useState(false);

  const startTimeRef = useRef(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (!hasUser) navigate('/');
  }, [hasUser, navigate]);

  async function finishGame(finalCorrect, finalAnswered) {
    if (finishedRef.current) return;
    finishedRef.current = true;
    stop();

    const durationMs = Date.now() - startTimeRef.current;
    setResult({ score: finalCorrect, correctAnswers: finalCorrect, answered: finalAnswered, durationMs });
    setGameState('finished');

    try {
      const { isNewBest: newBest } = await recordGameResult(userName, GAME_ID, {
        score: finalCorrect,
        correctAnswers: finalCorrect,
        totalQuestions: TOTAL_QUESTIONS,
        maxCombo: 0,
        durationMs,
      });
      setIsNewBest(newBest);
    } catch {
      // Sem internet / erro ao salvar: mostra o resultado mesmo assim.
      setIsNewBest(false);
    }
  }

  // The timer callback closes over the latest state because useGameTimer keeps a
  // ref to the current onTimeout on every render.
  function handleTimeout() {
    finishGame(correctCount, currentIndex);
  }

  const { timeLeftMs, start, stop } = useGameTimer(TOTAL_TIME_MS, handleTimeout);

  const currentQuestion = questions[currentIndex];

  function handleStart() {
    finishedRef.current = false;

    setQuestions(generateAllQuestions());
    setCurrentIndex(0);
    setCorrectCount(0);
    setResult(null);
    startTimeRef.current = Date.now();
    setGameState('playing');
    sound.playClick();
    start();
  }

  function handleAnswer(selected) {
    if (finishedRef.current) return;

    const correct = selected === currentQuestion.correctAnswer;
    const newCorrect = correct ? correctCount + 1 : correctCount;
    const newAnswered = currentIndex + 1;

    if (correct) sound.playCorrect();
    else sound.playWrong();
    setCorrectCount(newCorrect);

    if (newAnswered >= TOTAL_QUESTIONS) {
      finishGame(newCorrect, newAnswered);
      return;
    }
    setCurrentIndex(newAnswered);
  }

  if (!hasUser) return null;

  const secondsLeft = Math.ceil(timeLeftMs / 1000);

  return (
    <div className="completa-page">
      {gameState === 'idle' && (
        <div className="completa-page__idle">
          <span className="completa-page__eyebrow">Matemática</span>
          <h1 className="completa-page__title">Tabuada Completa</h1>
          <p className="completa-page__description">
            Responda as {TOTAL_QUESTIONS} multiplicações da tabuada (0 a 9), uma de cada vez.
            Você tem {TOTAL_TIME_MS / 1000} segundos no total — sua nota é o número de acertos!
          </p>
          <Button variant="primary" onClick={handleStart}>
            Iniciar desafio
          </Button>
          <TopScores subjectId="math_completa" unit="acertos" />
        </div>
      )}

      {gameState === 'playing' && currentQuestion && (
        <div className="completa-page__playing">
          <ProgressTimer timeLeftMs={timeLeftMs} durationMs={TOTAL_TIME_MS} />

          <div className="completa-hud">
            <div className="completa-hud__item">
              <span className="completa-hud__label">Tempo</span>
              <span
                className={`completa-hud__value completa-hud__value--time ${secondsLeft <= 10 ? 'is-low' : ''}`}
              >
                {secondsLeft}s
              </span>
            </div>
            <div className="completa-hud__item">
              <span className="completa-hud__label">Acertos</span>
              <motion.span
                key={correctCount}
                className="completa-hud__value completa-hud__value--score"
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                {correctCount}
              </motion.span>
            </div>
            <div className="completa-hud__item">
              <span className="completa-hud__label">Questão</span>
              <span className="completa-hud__value">
                {currentIndex + 1}/{TOTAL_QUESTIONS}
              </span>
            </div>
          </div>

          <QuestionCard
            question={currentQuestion}
            selectedOption={null}
            answeredState={null}
            onAnswer={handleAnswer}
            animated={false}
          />
        </div>
      )}

      {gameState === 'finished' && result && (
        <GameResultModal
          score={result.score}
          scoreUnit="acertos"
          stats={[
            { value: `${result.answered}/${TOTAL_QUESTIONS}`, label: 'Respondidas' },
            { value: `${result.answered - result.correctAnswers}`, label: 'Erros' },
          ]}
          isNewBest={isNewBest}
          onPlayAgain={handleStart}
          onViewRanking={() => navigate('/ranking')}
          onGoHome={() => navigate('/')}
        />
      )}
    </div>
  );
}
