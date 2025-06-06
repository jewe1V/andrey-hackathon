import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Войти';
    }, []);

    const validateForm = () => {
        const newErrors = {};

        // Проверка email
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            newErrors.email = 'Неверный формат email';
        }

        // Проверка password: минимум 8 символов, содержит специальный символ
        if (!/^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)) {
            newErrors.password = 'Пароль: мин. 8 символов, 1 спецсимвол (!@#$%^&*)';
        }

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
            // Формируем URL с параметрами
            const queryParams = new URLSearchParams({
                email,
                password,
            }).toString();
            const url = `${API_URL}/auth/login?${queryParams}`;

            // Отправляем GET-запрос с помощью fetch
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Проверяем, успешен ли запрос
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message ||
                    errorData.errors?.join(', ') ||
                    'Ошибка входа. Проверьте email или пароль.'
                );
            }

            // Получаем данные ответа
            const data = await response.json();

            // Предполагаем, что сервер возвращает токен в data.token
            const token = data.token;
            if (token) {
                localStorage.setItem('token', token);
                setErrors({});
                navigate('/main');
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
                <h2>Вход</h2>
                {errors.server && <p className="error-message">{errors.server}</p>}
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Введите email"
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
