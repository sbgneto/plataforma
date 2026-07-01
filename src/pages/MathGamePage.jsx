import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useSound } from '../hooks/useSound';
import { useGameTimer } from '../hooks/useGameTimer';
import { generateQuestions } from '../games/math/mathQuestionGenerator';
import {
  QUESTIONS_PER_GAME,
  TIME_PER_QUESTION_MS,
  FEEDBACK_DELAY_MS,
  COMBO_THRESHOLD,
  calculatePoints,
  normalizeScore,
} from '../games/math/mathGameConfig';
import { recordGameResult, getUserStats } from '../services/scoreService';
import { QuestionCard } from '../components/game/QuestionCard';
import { ProgressTimer } from '../components/game/ProgressTimer';
import { ScoreHUD } from '../components/game/ScoreHUD';
import { GameResultModal } from '../components/game/GameResultModal';
import { TopScores } from '../components/game/TopScores';
import { Button } from '../components/ui/Button';
import './MathGamePage.css';

export function MathGamePage() {
  const { userName, hasUser } = useUser();
  const navigate = useNavigate();
  const sound = useSound();

  const [gameState, setGameState] = useState('idle');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answeredState, setAnsweredState] = useState(null);
  const [result, setResult] = useState(null);
  const [isNewBest, setIsNewBest] = useState(false);

  const startTimeRef = useRef(null);
  const previousBestRef = useRef(0);

  useEffect(() => {
    if (!hasUser) navigate('/');
  }, [hasUser, navigate]);

  function handleTimeout() {
    handleAnswer(null);
  }

  const { timeLeftMs, start, stop } = useGameTimer(TIME_PER_QUESTION_MS, handleTimeout);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (gameState === 'playing' && currentQuestion) {
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, currentIndex]);

  function handleStart() {
    const stats = getUserStats(userName);
    previousBestRef.current = stats?.subjects?.math?.bestScore ?? 0;

    setQuestions(generateQuestions(QUESTIONS_PER_GAME));
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectCount(0);
    setSelectedOption(null);
    setAnsweredState(null);
    setResult(null);
    startTimeRef.current = Date.now();
    setGameState('playing');
    sound.playClick();
  }

  function handleAnswer(selected) {
    if (answeredState !== null) return;
    stop();

    const correct = selected !== null && selected === currentQuestion.correctAnswer;
    const nextCombo = correct ? combo + 1 : 0;
    const points = calculatePoints({ correct, timeLeftMs, combo });
    const newScore = score + points;
    const newMaxCombo = Math.max(maxCombo, nextCombo);
    const newCorrectCount = correct ? correctCount + 1 : correctCount;

    setSelectedOption(selected);
    setAnsweredState(correct ? 'correct' : 'wrong');
    setScore(newScore);
    setCombo(nextCombo);
    setMaxCombo(newMaxCombo);
    setCorrectCount(newCorrectCount);

    if (correct) {
      if (nextCombo >= COMBO_THRESHOLD) {
        sound.playCombo();
      } else {
        sound.playCorrect();
      }
    } else {
      sound.playWrong();
    }

    setTimeout(() => {
      goToNext({ score: newScore, correctCount: newCorrectCount, maxCombo: newMaxCombo });
    }, FEEDBACK_DELAY_MS);
  }

  function goToNext(finalStats) {
    if (currentIndex + 1 >= questions.length) {
      finishGame(finalStats);
      return;
    }
    setSelectedOption(null);
    setAnsweredState(null);
    setCurrentIndex((i) => i + 1);
  }

  function finishGame(finalStats) {
    const durationMs = Date.now() - startTimeRef.current;
    const finalResult = {
      score: normalizeScore(finalStats.score),
      correctAnswers: finalStats.correctCount,
      totalQuestions: questions.length,
      maxCombo: finalStats.maxCombo,
      durationMs,
    };
    recordGameResult(userName, 'math', finalResult);
    setIsNewBest(finalResult.score > previousBestRef.current);
    setResult(finalResult);
    setGameState('finished');
  }

  if (!hasUser) return null;

  return (
    <div className="math-page">
      {gameState === 'idle' && (
        <div className="math-page__idle">
          <span className="math-page__eyebrow">Matemática</span>
          <h1 className="math-page__title">Tabuada do 0 ao 9</h1>
          <p className="math-page__description">
            {QUESTIONS_PER_GAME} perguntas, {TIME_PER_QUESTION_MS / 1000}s cada. Responda rápido
            e encadeie acertos para ganhar bônus de combo!
          </p>
          <Button variant="primary" onClick={handleStart}>
            Iniciar partida
          </Button>
          <TopScores subjectId="math" unit="pts" />
        </div>
      )}

      {gameState === 'playing' && currentQuestion && (
        <div className="math-page__playing">
          <ProgressTimer timeLeftMs={timeLeftMs} durationMs={TIME_PER_QUESTION_MS} />
          <ScoreHUD
            score={normalizeScore(score)}
            combo={combo}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
          />
          <QuestionCard
            question={currentQuestion}
            selectedOption={selectedOption}
            answeredState={answeredState}
            onAnswer={handleAnswer}
          />
        </div>
      )}

      {gameState === 'finished' && result && (
        <GameResultModal
          score={result.score}
          scoreUnit="pontos"
          stats={[
            { value: `${result.correctAnswers}/${result.totalQuestions}`, label: 'Acertos' },
            { value: `x${result.maxCombo}`, label: 'Combo máximo' },
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
