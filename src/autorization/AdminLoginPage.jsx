import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

export const AdminLoginPage = () => {
    const [nickName, setNickName] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Войти';
    }, []);

    const validateForm = () => {
        const newErrors = {};

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // Валидация формы
        if (!validateForm()) {
            return;
        }

        try {
            const queryParams = new URLSearchParams({
                nickName,
                password,
            }).toString();
            const url = `${API_URL}/auth/admin-login?${queryParams}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message ||
                    errorData.errors?.join(', ') ||
                    'Ошибка входа. Проверьте email или пароль.'
                );
            }

            const data = await response.json();

            const token = data.token;
            if (token) {
                localStorage.setItem('token', token);
                setErrors({});
                navigate('/admin');
            } else {
                setErrors({ server: 'Токен не получен от сервера' });
            }
        } catch (err) {
            console.error('Login error:', err);
            setErrors({
                server: err.message || 'Ошибка входа. Проверьте email или пароль.',
            });
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Администрация</h2>
                {errors.server && <p className="error-message">{errors.server}</p>}
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">Имя</label>
                        <input
                            type="text"
                            id="email"
                            value={nickName}
                            onChange={(e) => setNickName(e.target.value)}
                            required
                            placeholder="Введите Nickname"
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Введите пароль"
                            className={errors.password ? 'error' : ''}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>
                    <button type="submit" className="submit-btn">
                        Войти
                    </button>
                </form>
                <p>
                    Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </p>
            </div>
        </div>
    );
};
