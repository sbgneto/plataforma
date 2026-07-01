import { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';
import { getGlobalRanking, getUserStats } from '../services/scoreService';
import { RankingTable } from '../components/ranking/RankingTable';
import { UserStatsCard } from '../components/ranking/UserStatsCard';
import { MATH_GAMES } from '../constants/mathGames';
import './RankingPage.css';

// One tab per game — the ranking shows each user's best (max) score per game,
// never a sum across games or attempts.
const TABS = MATH_GAMES.map((game) => ({ id: game.id, label: game.label }));

export function RankingPage() {
  const { userName, hasUser } = useUser();
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    getGlobalRanking(activeTab)
      .then((data) => {
        if (!active) return;
        setEntries(data);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setEntries([]);
        setError(true);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [activeTab]);

  useEffect(() => {
    if (!hasUser) {
      setUserStats(null);
      return undefined;
    }
    let active = true;
    getUserStats(userName)
      .then((stats) => {
        if (active) setUserStats(stats);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [hasUser, userName]);

  return (
    <div className="ranking-page">
      <h1 className="ranking-page__title">Ranking</h1>
      <p className="ranking-page__subtitle">Placar compartilhado</p>

      {hasUser && userStats && (
        <UserStatsCard userName={userName} stats={userStats} games={MATH_GAMES} />
      )}

      <div className="ranking-page__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`ranking-page__tab ${activeTab === tab.id ? 'ranking-page__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="ranking-page__status">Carregando ranking…</p>
      ) : error ? (
        <p className="ranking-page__status">Não foi possível carregar o ranking. Verifique sua conexão.</p>
      ) : (
        <RankingTable entries={entries} currentUserName={userName} />
      )}
    </div>
  );
}
