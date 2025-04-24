import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import '../styles/RegisterPage.css';

export const RegisterPage = () => {
    const [fullName, setFullName] = useState('');
    const [university, setUniversity] = useState('');
    const [telegram, setTelegram] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        document.title = 'Зарегистрироваться';
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }
        setError('');
        console.log('Register:', { fullName, university, telegram, email, password });
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
