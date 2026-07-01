import { motion } from 'framer-motion';
import { formatNumber } from '../../utils/formatters';
import './RankingTable.css';

export function RankingTable({ entries, currentUserName }) {
  if (entries.length === 0) {
    return <p className="ranking-table__empty">Ninguém no ranking ainda. Seja o primeiro a jogar!</p>;
  }

  return (
    <ol className="ranking-table">
      {entries.map((entry, index) => (
        <motion.li
          key={entry.name}
          className={`ranking-table__row ${entry.name === currentUserName ? 'ranking-table__row--active' : ''}`}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03 }}
        >
          <span className="ranking-table__position">{index + 1}º</span>
          <span className="ranking-table__name">{entry.name}</span>
          <span className="ranking-table__score">{formatNumber(entry.score)} pts</span>
        </motion.li>
      ))}
    </ol>
  );
}
