import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {HackathonCreateModal} from './HackathonCreateModal.jsx';
import '../styles/HackathonPage.css';


export const HackathonPage = () => {
    const [hackathons, setHackathons] = useState([]);
    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editHackathon, setEditHackathon] = useState(null);

    const navigate = useNavigate();

    // Получение токена
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
    };

    // Получение списка хакатонов
    useEffect(() => {
        document.title = 'Хакатоны';

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchHackathons = async () => {
            try {
                const response = await fetch(`${API_URL}/hackaton/get`, {
                    method: 'GET',
                    headers: getAuthHeaders(),
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/login');
                        throw new Error('Не авторизован. Пожалуйста, войдите в систему.');
                    }
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка получения списка хакатонов');
                }

                const data = await response.json();
                setHackathons(data);
            } catch (err) {
                setErrors({ server: err.message });
            }
        };

        fetchHackathons();
    }, [navigate]);

    // Удаление хакатона
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_URL}/hackaton/delete/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/login');
                    throw new Error('Не авторизован. Пожалуйста, войдите в систему.');
                }
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка удаления хакатона');
            }

            setHackathons(hackathons.filter((h) => h.id !== id));
        } catch (err) {
            setErrors({ server: err.message });
        }
    };

    // Получение хакатона по ID (для редактирования)
    const handleEdit = async (id) => {
        try {
            const response = await fetch(`${API_URL}/hackaton/get/${id}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/login');
                    throw new Error('Не авторизован. Пожалуйста, войдите в систему.');
                }
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка получения хакатона');
            }

            const hackathon = await response.json();
            setEditHackathon(hackathon);
            setIsModalOpen(true);
        } catch (err) {
            setErrors({ server: err.message });
        }
    };

    // Изменение статуса хакатона (активация/деактивация)
    const handleToggleActive = async (id, isActive) => {
        try {
            const response = await fetch(`${API_URL}/hackaton/update/`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ id: id, isActive: !isActive }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/login');
                    throw new Error('Не авторизован. Пожалуйста, войдите в систему.');
                }
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка изменения статуса хакатона');
            }

            setHackathons(
                hackathons.map((h) =>
                    h.id === id ? { ...h, isActive: !isActive } : h
                )
            );
        } catch (err) {
            setErrors({ server: err.message });
        }
    };

    // Обработка создания/обновления хакатона
    const handleHackathonSubmit = (newHackathon) => {
        if (editHackathon) {
            // Обновление существующего хакатона
            setHackathons(
                hackathons.map((h) => (h.id === newHackathon.id ? newHackathon : h))
            );
        } else {
            // Добавление нового хакатона
            setHackathons([...hackathons, newHackathon]);
        }
        setIsModalOpen(false);
        setEditHackathon(null);
    };

    return (
        <div className="hackathon-page-container">
            <div className="hackathon-page-box">
                <h2>Управление хакатонами</h2>
                {errors.server && <p className="hackathon-error-message">{errors.server}</p>}

                {/* Кнопка для открытия модального окна */}
                <button
                    onClick={() => {
                        setEditHackathon(null);
                        setIsModalOpen(true);
                    }}
                    className="hackathon-create-btn"
                >
                    Создать хакатон
                </button>

                {/* Список хакатонов */}
                <div className="hackathon-list-group">
                    <h3>Список хакатонов</h3>
                    {hackathons.length === 0 ? (
                        <p>Хакатоны не найдены</p>
                    ) : (
                        <ul>
                            {hackathons.map((hackathon) => (
                                <li key={hackathon.id} className="hackathon-item">
                                    <div>
                                        <strong>{hackathon.title}</strong>
                                        <p>{hackathon.description}</p>
                                        <p>Участники: {hackathon.participantsCount}</p>
                                        <p>
                                            Статус: {hackathon.isActive ? 'Активен' : 'Неактивен'}
                                        </p>
                                    </div>
                                    <div className="hackathon-actions">
                                        <button
                                            onClick={() => handleEdit(hackathon.id)}
                                            className="hackathon-edit-btn"
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            onClick={() => handleDelete(hackathon.id)}
                                            className="hackathon-delete-btn"
                                        >
                                            Удалить
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleToggleActive(hackathon.id, hackathon.isActive)
                                            }
                                            className="hackathon-toggle-btn"
                                        >
                                            {hackathon.isActive
                                                ? 'Сделать неактивным'
                                                : 'Сделать активным'}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Модальное окно для создания/редактирования */}
                {isModalOpen && (
                    <HackathonCreateModal
                        onClose={() => {
                            setIsModalOpen(false);
                            setEditHackathon(null);
                        }}
                        onSubmit={handleHackathonSubmit}
                        initialData={editHackathon}
                    />
                )}
            </div>
        </div>
    );
};
