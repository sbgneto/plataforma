import { HashRouter } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { AppRouter } from './router/AppRouter';
import './App.css';

function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <Header />
        <main className="app-main">
          <AppRouter />
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
