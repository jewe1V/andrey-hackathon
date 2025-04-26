import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProfilePage.css';

export const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    // Получение данных о пользователе
    useEffect(() => {
        document.title = 'Профиль пользователя';
        const token = localStorage.getItem('token');

        if (!token) {
            console.log('Токен отсутствует, перенаправление на /login');
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                // Получение ID текущего пользователя
                const currentUserResponse = await axios.get(`${API_URL}/auth/get-current-user`, {
                    headers: { Authorization: `Bearer ${token}`, Accept: '*/*' },
                });
                const userId = currentUserResponse.data.id;

                // Получение полной информации о пользователе
                const userResponse = await axios.get(`${API_URL}/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}`, Accept: '*/*' },
                });
                setUser(userResponse.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                if (error.response?.status === 401) {
                    console.log('Ошибка 401: Токен недействителен или отсутствует доступ');
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setErrors({ server: `Ошибка при загрузке данных: ${error.message}` });
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (isLoading) {
        return <div className="loading">Загрузка...</div>;
    }

    return (
        <div className="profile-page-container">
            {errors.server && <p className="error-message">{errors.server}</p>}

            {/* Информация о пользователе */}
            {user ? (
                <div className="profile-card">
                    <h2>Профиль пользователя</h2>
                    <div className="profile-info">
                        <p>
                            <strong>ФИО:</strong> {user.fullName}
                        </p>
                        <p>
                            <strong>Университет:</strong> {user.university || 'Не указан'}
                        </p>
                        <p>
                            <strong>Email:</strong> {user.email}
                        </p>
                        <p>
                            <strong>Telegram:</strong> {user.telegram || 'Не указан'}
                        </p>
                        <p>
                            <strong>Роль:</strong> {user.role}
                        </p>
                        <p>
                            <strong>ID команды:</strong> {user.teamId ? user.teamId : 'Нет команды'}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/login');
                        }}
                        className="logout-button"
                    >
                        Выйти
                    </button>
                </div>
            ) : (
                <div className="no-profile">
                    <h2>Данные профиля не найдены</h2>
                </div>
            )}
        </div>
    );
};
