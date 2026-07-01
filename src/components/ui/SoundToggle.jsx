import { useSound } from '../../hooks/useSound';
import './SoundToggle.css';

export function SoundToggle() {
  const { muted, toggleMuted } = useSound();

  return (
    <button
      type="button"
      className="sound-toggle"
      onClick={toggleMuted}
      aria-label={muted ? 'Ativar som' : 'Silenciar som'}
      title={muted ? 'Ativar som' : 'Silenciar som'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
