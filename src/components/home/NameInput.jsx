import { NAME_MAX_LENGTH } from '../../utils/validators';
import './NameInput.css';

export function NameInput({ value, onChange }) {
  return (
    <div className="name-input">
      <label htmlFor="user-name" className="name-input__label">
        Como você se chama?
      </label>
      <input
        id="user-name"
        type="text"
        className="name-input__field"
        placeholder="Digite seu nome"
        value={value}
        maxLength={NAME_MAX_LENGTH}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
      />
      <span className="name-input__counter">
        {value.length}/{NAME_MAX_LENGTH}
      </span>
    </div>
  );
}
