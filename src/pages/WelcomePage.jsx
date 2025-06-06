import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/WelcomePage.css';
import Logo from '../assets/logo.png'

export const WelcomeSection = () => {
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Проверка авторизации

    useEffect(() => {
        document.title = 'Добро пожаловать | Хакатон';

    }, [token]);


    return (
        <section className="welcome-section">
            <div className="welcome-content">
                {errors.server && <p className="error-message">{errors.server}</p>}
                    <>
                        <h1 className="welcome-title">Хакатон G2G4 2025</h1>
                        <p className="welcome-description">
                            Присоединяйтесь к нашему хакатону и создавайте инновационные решения! Соревнуйтесь с лучшими разработчиками, решайте реальные бизнес-задачи и получите
                            шанс выиграть ценные призы.
                            <br />
                            <strong>Когда:</strong> 15-17 мая 2025 года
                            <br />
                            <strong>Где:</strong> Онлайн и оффлайн (Екатеринбург)
                        </p>
                    </>

                {/* Заглушка для изображения */}
                <div className="welcome-image-placeholder">
                <img src={Logo}/>
                </div>

                {/* Кнопка действия */}
                <button
                    onClick={() => navigate(token ? '/main/hackathons' : '/login')}
                    className="welcome-action-button"
                >
                    {token ? 'Перейти к хакатону' : 'Войти'}
                </button>

            </div>
        </section>
    );
};
