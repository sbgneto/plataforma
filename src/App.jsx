import { BrowserRouter } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { AppRouter } from './router/AppRouter';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <main className="app-main">
          <AppRouter />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
