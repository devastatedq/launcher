import { useEffect, useState, type FormEvent } from 'react';
import { User } from '@/shared/types';
import Icon from '../components/Icon';
import WindowControls from '../components/WindowControls';

const REMEMBER_KEY = 'trimira.rememberedUser';

interface Props {
  onLogin: (user: User) => void;
}

export default function LoginScreen({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      setUsername(saved);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!window.electron) {
        setError('Лаунчер доступен только в приложении');
        return;
      }

      const result = await window.electron.invoke(
        isRegister ? 'auth:register' : 'auth:login',
        { username, password }
      );

      if (result.success) {
        if (remember) localStorage.setItem(REMEMBER_KEY, username.trim());
        else localStorage.removeItem(REMEMBER_KEY);

        if (isRegister) {
          setIsRegister(false);
          setError('Регистрация успешна! Теперь войдите.');
        } else {
          onLogin(result.user);
        }
      } else {
        setError(result.error || 'Не удалось выполнить вход');
      }
    } catch {
      setError('Ошибка подключения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="t9-screen t9-screen--auth">
      <div className="t9-drag" onDoubleClick={() => window.electron?.invoke('window:toggle-maximize')} />
      <WindowControls />

      <div className="t9-auth-panel t9-ornate">
        <div className="t9-auth-logo">
          <span className="t9-logo-text">TRIMIRA</span>
          <div className="t9-auth-logo-sub">Мир приключений</div>
        </div>

        <form className="t9-auth-form" onSubmit={handleSubmit}>
          <label className="t9-field">
            <Icon name="mail" className="t9-icon" />
            <input
              type="text"
              placeholder="Логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
              required
            />
          </label>

          <label className="t9-field">
            <Icon name="lock" className="t9-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              required
            />
            <button
              type="button"
              className="t9-eye"
              title={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              onClick={() => setShowPassword((v) => !v)}
            >
              <Icon name={showPassword ? 'eyeOff' : 'eye'} className="t9-icon" />
            </button>
          </label>

          <div className="t9-auth-row">
            <label className="t9-check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="t9-box" />
              <span>Запомнить меня</span>
            </label>
            <button
              type="button"
              className="t9-link"
              onClick={() => setError('Восстановление пароля — обратитесь в поддержку Trimira')}
            >
              Забыли пароль?
            </button>
          </div>

          {error && <div className="t9-auth-error">{error}</div>}

          <button type="submit" className="t9-btn t9-btn--red t9-btn--auth" disabled={loading}>
            {loading ? 'Загрузка...' : isRegister ? 'Регистрация' : 'Вход'}
          </button>

          <button
            type="button"
            className="t9-btn t9-btn--dark t9-btn--auth"
            disabled={loading}
            onClick={() => {
              setIsRegister((v) => !v);
              setError('');
            }}
          >
            {isRegister ? 'У меня есть аккаунт' : 'Создать аккаунт'}
          </button>
        </form>
      </div>
    </div>
  );
}
