import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const TeamPage = () => {
    const [team, setTeam] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [leaderId, setLeaderId] = useState(null);
    const [cases, setCases] = useState([]); // Для списка кейсов
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        link: '',
        gitHubLink: '',
        googleDiskLink: '',
        caseId: 0,
    });
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    // Получение данных о команде, пользователе и кейсах
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Получение текущего пользователя
                const userResponse = await axios.get(`${API_URL}/auth/get-current-user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLeaderId(userResponse.data.id);

                // Получение списка кейсов
                const casesResponse = await axios.get(`${API_URL}/case/get`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCases(casesResponse.data);

                // Получение данных о команде
                const teamResponse = await axios.get(`${API_URL}/team/my-team`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTeam(teamResponse.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    navigate('/login');
                }
                setErrors({ server: 'Ошибка при получении данных: ' + error.message });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    // Обработка изменений в форме
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Обработка отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!leaderId) {
            setErrors({ server: 'ID лидера не определен' });
            return;
        }
        try {
            const response = await axios.post(
                `${API_URL}/team`,
                {
                    id: 0,
                    title: formData.title,
                    description: formData.description,
                    link: formData.link,
                    leaderId: leaderId,
                    gitHubLink: formData.gitHubLink,
                    googleDiskLink: formData.googleDiskLink,
                    caseId: parseInt(formData.caseId),
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );
            setTeam(response.data);
            setShowForm(false);
            setFormData({
                title: '',
                description: '',
                link: '',
                gitHubLink: '',
                googleDiskLink: '',
                caseId: 0,
            });
            setErrors({});
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login');
            }
            setErrors({ server: 'Ошибка при создании команды: ' + error.message });
        }
    };

    if (isLoading) {
        return <div className="loading">Загрузка...</div>;
    }

    return (
        <div className="container">
            {errors.server && <p className="error-message">{errors.server}</p>}
            {team ? (
                <div className="team-card">
                    <h2>{team.title}</h2>
                    <p><strong>Описание:</strong> {team.description}</p>
                    {team.link && (
                        <p>
                            <strong>Ссылка:</strong> <a href={team.link}>{team.link}</a>
                        </p>
                    )}
                    {team.gitHubLink && (
                        <p>
                            <strong>GitHub:</strong> <a href={team.gitHubLink}>{team.gitHubLink}</a>
                        </p>
                    )}
                    {team.googleDiskLink && (
                        <p>
                            <strong>Google Disk:</strong> <a href={team.googleDiskLink}>{team.googleDiskLink}</a>
                        </p>
                    )}
                    <p>
                        <strong>Кейс:</strong>{' '}
                        {cases.find((c) => c.id === team.caseId)?.title || 'Не указан'}
                    </p>
                </div>
            ) : (
                <div className="no-team">
                    <h2>У вас нет команды</h2>
                    <button className="btn" onClick={() => setShowForm(true)}>
                        Создать команду
                    </button>
                    <button className="btn secondary">У меня нет команды</button>
                </div>
            )}

            {showForm && (
                <div className="form-container">
                    <h3>Создать новую команду</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="title"
                            placeholder="Название команды"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                        <textarea
                            name="description"
                            placeholder="Описание"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="url"
                            name="link"
                            placeholder="Ссылка на команду"
                            value={formData.link}
                            onChange={handleInputChange}
                        />
                        <input
                            type="url"
                            name="gitHubLink"
                            placeholder="GitHub ссылка"
                            value={formData.gitHubLink}
                            onChange={handleInputChange}
                        />
                        <input
                            type="url"
                            name="googleDiskLink"
                            placeholder="Google Disk ссылка"
                            value={formData.googleDiskLink}
                            onChange={handleInputChange}
                        />
                        <select
                            name="caseId"
                            value={formData.caseId}
                            onChange={handleInputChange}
                            required
                        >
                            <option value={0} disabled>
                                Выберите кейс
                            </option>
                            {cases.map((caseItem) => (
                                <option key={caseItem.id} value={caseItem.id}>
                                    {caseItem.title}
                                </option>
                            ))}
                        </select>
                        <div className="form-actions">
                            <button type="submit" className="btn">Создать</button>
                            <button
                                type="button"
                                className="btn secondary"
                                onClick={() => setShowForm(false)}
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};
