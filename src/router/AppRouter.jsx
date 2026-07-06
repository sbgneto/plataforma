import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { HomePage } from '../pages/HomePage';
import { MathMenuPage } from '../pages/MathMenuPage';
import { MathGamePage } from '../pages/MathGamePage';
import { AddSubGamePage } from '../pages/AddSubGamePage';
import { TabuadaCompletaPage } from '../pages/TabuadaCompletaPage';
import { RankingPage } from '../pages/RankingPage';

export function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          }
        />
        <Route
          path="/matematica"
          element={
            <PageTransition>
              <MathMenuPage />
            </PageTransition>
          }
        />
        <Route
          path="/matematica/tabuada"
          element={
            <PageTransition>
              <MathGamePage />
            </PageTransition>
          }
        />
        <Route
          path="/matematica/soma-subtracao"
          element={
            <PageTransition>
              <AddSubGamePage />
            </PageTransition>
          }
        />
        <Route
          path="/matematica/tabuada-completa"
          element={
            <PageTransition>
              <TabuadaCompletaPage />
            </PageTransition>
          }
        />
        <Route
          path="/ranking"
          element={
            <PageTransition>
              <RankingPage />
            </PageTransition>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
