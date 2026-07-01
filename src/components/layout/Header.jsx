import { Link } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import { SoundToggle } from '../ui/SoundToggle';
import './Header.css';

export function Header() {
  const { userName, hasUser } = useUser();

  return (
    <header className="app-header">
      <Link to="/" className="app-header__logo">
        Pipo<span>Edu</span>
      </Link>

      <div className="app-header__actions">
        {hasUser && (
          <Link to="/" className="app-header__user" title="Trocar nome">
            {userName}
          </Link>
        )}
        <SoundToggle />
      </div>
    </header>
  );
}
