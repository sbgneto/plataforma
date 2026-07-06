import { motion, AnimatePresence } from 'framer-motion';
import { AnswerButton } from './AnswerButton';
import './QuestionCard.css';

export function QuestionCard({ question, selectedOption, answeredState, onAnswer, animated = true }) {
  const getStatus = (option) => {
    if (!answeredState) return 'idle';
    if (option === question.correctAnswer) return 'correct';
    if (option === selectedOption) return 'wrong';
    return 'disabled';
  };

  const content = (
    <>
      <h2 className="question-card__prompt">
        {question.a} {question.operator ?? '×'} {question.b} = ?
      </h2>

      <div className="question-card__options">
        {question.options.map((option) => (
          <AnswerButton
            key={option}
            value={option}
            status={getStatus(option)}
            onClick={onAnswer}
          />
        ))}
      </div>
    </>
  );

  return (
    <div className="question-card">
      {animated ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            className="question-card__body"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="question-card__body">{content}</div>
      )}
    </div>
  );
}
