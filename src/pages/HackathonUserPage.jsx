import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'

import axios from 'axios';
import '../styles/HackathonUserPage.css';


export const HackathonUserPage = () => {
    const [hackathon, setHackathon] = useState(null);
    const [cases, setCases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    // Получение данных о хакатоне и кейсах
    useEffect(() => {
        document.title = 'Активный хакатон';
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                // Получение активного хакатона
                const hackathonResponse = await axios.get(`${API_URL}/hackaton/get/active`, {
                    headers: { Authorization: `Bearer ${token}`, Accept: '*/*' },
                });
                setHackathon(hackathonResponse.data);

                // Получение списка кейсов
                const casesResponse = await axios.get(`${API_URL}/case/get`, {
                    headers: { Authorization: `Bearer ${token}`, Accept: '*/*' },
                });
                setCases(casesResponse.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    navigate('/login');
                }
                setErrors({ server: 'Ошибка при загрузке данных: ' + error.message });
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
        <div className="hackathon-user-page-container">
            {errors.server && <p className="error-message">{errors.server}</p>}

            {/* Информация о хакатоне */}
            {hackathon ? (
                <div className="hackathonr-card">
                    <h2>{hackathon.title}</h2>
                    <p className="hackathon-description">{hackathon.description}</p>
                    <p>
                        <strong>Участники:</strong> {hackathon.participantsCount}
                    </p>
                    {/* Условное отображение дат, если они валидны */}
                    {hackathon.startDate && new Date(hackathon.startDate).getFullYear() !== 1 && (
                        <p>
                            <strong>Дата начала:</strong>{' '}
                            {new Date(hackathon.startDate).toLocaleDateString('ru-RU')}
                        </p>
                    )}
                    {hackathon.endDate && new Date(hackathon.endDate).getFullYear() !== 1 && (
                        <p>
                            <strong>Дата окончания:</strong>{' '}
                            {new Date(hackathon.endDate).toLocaleDateString('ru-RU')}
                        </p>
                    )}
                </div>
            ) : (
                <div className="no-hackathon">
                    <h2>Нет активного хакатона</h2>
                </div>
            )}

            {/* Список кейсов */}
            {hackathon && (
                <div className="cases-list-group">
                    <h3>Кейсы</h3>
                    {cases.length === 0 || !cases.some((c) => c.hackathonId === hackathon.id) ? (
                        <p>Кейсы не найдены</p>
                    ) : (
                        <ul>
                            {cases
                                .filter((caseItem) => caseItem.hackathonId === hackathon.id)
                                .map((caseItem) => (
                                    <li key={caseItem.id} className="case-item">
                                        <div>
                                            <strong>{caseItem.title}</strong>
                                            <p>{caseItem.description}</p>
                                            <p>
                                                <strong>Компания-спонсор:</strong> {caseItem.author}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};
