import { useState, useEffect } from 'react';
import '../styles/HackathonCreateModal.css';


export const HackathonCreateModal = ({ onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        id: 0,
        title: '',
        description: '',
        participantsCount: 0,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    // Валидация формы
    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Название хакатона обязательно';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Описание хакатона обязательно';
        }
        if (formData.participantsCount < 0) {
            newErrors.participantsCount = 'Количество участников не может быть отрицательным';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Получение токена
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
    };

    // Обработка отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const url = initialData
                ? `${API_URL}/hackaton/update`
                : `${API_URL}/hackaton/create`;
            const method = initialData ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Не авторизован. Пожалуйста, войдите в систему.');
                }
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка обработки хакатона');
            }

            const newHackathon = await response.json();
            onSubmit(newHackathon);
        } catch (err) {
            setErrors({ server: err.message });
        }
    };

    return (
        <div className="hackathon-modal-overlay">
            <div className="hackathon-modal-content">
                <h2>{initialData ? 'Редактировать хакатон' : 'Создать хакатон'}</h2>
                {errors.server && <p className="hackathon-error-message">{errors.server}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="hackathon-input-group">
                        <label htmlFor="title">Название хакатона</label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="Введите название"
                            className={errors.title ? 'hackathon-error' : ''}
                        />
                        {errors.title && <span className="hackathon-error-message">{errors.title}</span>}
                    </div>
                    <div className="hackathon-input-group">
                        <label htmlFor="description">Описание</label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            placeholder="Введите описание"
                            className={errors.description ? 'hackathon-error' : ''}
                        />
                        {errors.description && (
                            <span className="hackathon-error-message">{errors.description}</span>
                        )}
                    </div>
                    <div className="hackathon-input-group">
                        <label htmlFor="participantsCount">Количество участников</label>
                        <input
                            type="number"
                            id="participantsCount"
                            value={formData.participantsCount}
                            onChange={(e) =>
                                setFormData({ ...formData, participantsCount: Number(e.target.value) })
                            }
                            required
                            placeholder="Введите количество"
                            className={errors.participantsCount ? 'hackathon-error' : ''}
                        />
                        {errors.participantsCount && (
                            <span className="hackathon-error-message">{errors.participantsCount}</span>
                        )}
                    </div>
                    <div className="hackathon-modal-actions">
                        <button type="submit" className="hackathon-submit-btn">
                            {initialData ? 'Обновить' : 'Создать'}
                        </button>
                        <button type="button" onClick={onClose} className="hackathon-cancel-btn">
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
