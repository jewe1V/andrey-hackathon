import {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';
import axios from 'axios';

export const RegisterPage = () => {
    const [fullName, setFullName] = useState('');
    const [university, setUniversity] = useState('');
    const [telegram, setTelegram] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Зарегистрироваться';
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        // Валидация формы
        const validateForm = () => {
            // Проверка fullName: первая буква заглавная
            if (!/^[A-ZА-Я][a-zа-я\s]*$/.test(fullName.trim())) {
                return 'ФИО должно начинаться с заглавной буквы и содержать только буквы и пробелы';
            }

            // Проверка email: валидный формат
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
                return 'Неверный формат email';
            }

            // Проверка telegram: начинается с @
            if (!/^@[\w]+$/.test(telegram)) {
                return 'Telegram должен начинаться с @ и содержать только буквы, цифры или подчеркивания';
            }

            // Проверка password: минимум 8 символов, содержит специальный символ
            if (!/^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)) {
                return 'Пароль должен содержать минимум 8 символов и хотя бы один специальный символ (!@#$%^&*)';
            }

            // Проверка confirmPassword: совпадает с password
            if (password !== confirmPassword) {
                return 'Пароли не совпадают';
            }

            return null; // Нет ошибок
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            // Проверяем валидацию
            const validationError = validateForm();
            if (validationError) {
                setError(validationError);
                return;
            }
        };
        const formattedTelegram = telegram.startsWith('@') ? telegram : `@${telegram}`;

        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                id: 0,
                fullname: fullName,
                university: university,
                email: email,
                telegram: formattedTelegram,
                password: password,
                teamId: null,
                role: 'user',
            });
            console.log('Registration successful:', response.data);
            setError('');
            navigate('/login');
        } catch (e) {
            console.error('Registration error:', e);
            console.log(e.response?.data);
            setError(
                e.response.data
            );
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Регистрация</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="fullName">ФИО</label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            placeholder="Введите ФИО"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="university">ВУЗ</label>
                        <input
                            type="text"
                            id="university"
                            value={university}
                            onChange={(e) => setUniversity(e.target.value)}
                            required
                            placeholder="Введите название ВУЗа"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="telegram">Telegram</label>
                        <input
                            type="text"
                            id="telegram"
                            value={telegram}
                            onChange={(e) => setTelegram(e.target.value)}
                            required
                            placeholder="Введите @username"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Введите email"
                        />
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
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="confirmPassword">Подтверждение пароля</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Повторите пароль"
                        />
                    </div>
                    <button type="submit" className="submit-btn">
                        Зарегистрироваться
                    </button>
                </form>
                <p>
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
            </div>
        </div>
    );
};
