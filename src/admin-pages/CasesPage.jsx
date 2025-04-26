import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CasesPage.css';


export const CasesPage = () => {
    const [cases, setCases] = useState([]);
    const [hackathons, setHackathons] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        author: '',
        hackathonId: 0,
    });
    const [errors, setErrors] = useState({});
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editCase, setEditCase] = useState(null);

    const navigate = useNavigate();

    // Проверка токена
    useEffect(() => {
        document.title = 'Кейсы хакатонов';
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Получение хакатонов и кейсов
        const fetchData = async () => {
            try {
                // Получение списка хакатонов
                const hackathonResponse = await fetch(`${API_URL}/hackaton/get`, {
                    method: 'GET',
                    headers: getAuthHeaders(),
                });
                if (!hackathonResponse.ok) {
                    if (hackathonResponse.status === 401) {
                        navigate('/login');
                        throw new Error('Не авторизован');
                    }
                    throw new Error('Ошибка получения хакатонов');
                }
                const hackathonData = await hackathonResponse.json();
                setHackathons(hackathonData);

                // Получение списка кейсов
                const caseResponse = await fetch(`${API_URL}/case/get`, {
                    method: 'GET',
                    headers: getAuthHeaders(),
                });
                if (!caseResponse.ok) {
                    if (caseResponse.status === 401) {
                        navigate('/login');
                        throw new Error('Не авторизован');
                    }
                    throw new Error('Ошибка получения кейсов');
                }
                const caseData = await caseResponse.json();
                setCases(caseData);
            } catch (err) {
                setErrors({ server: err.message });
            }
        };

        fetchData();
    }, [navigate]);

    // Получение заголовков с токеном
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
    };

    // Обработка изменений в форме
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Создание или обновление кейса
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editCase ? `${API_URL}/case/update/${editCase.id}` : `${API_URL}/case/create`;
            const method = editCase ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    id: editCase ? editCase.id : 0,
                    title: formData.title,
                    description: formData.description,
                    author: formData.author,
                    hackathonId: parseInt(formData.hackathonId),
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/login');
                    throw new Error('Не авторизован');
                }
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при сохранении кейса');
            }

            const newCase = await response.json();
            if (editCase) {
                setCases(cases.map((c) => (c.id === newCase.id ? newCase : c)));
            } else {
                setCases([...cases, newCase]);
            }
            setIsFormOpen(false);
            setEditCase(null);
            setFormData({ title: '', description: '', author: '', hackathonId: 0 });
        } catch (err) {
            setErrors({ server: err.message });
        }
    };

    // Удаление кейса
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_URL}/case/delete/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/login');
                    throw new Error('Не авторизован');
                }
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка удаления кейса');
            }

            setCases(cases.filter((c) => c.id !== id));
        } catch (err) {
            setErrors({ server: err.message });
        }
    };

    // Редактирование кейса
    const handleEdit = (caseItem) => {
        setEditCase(caseItem);
        setFormData({
            title: caseItem.title,
            description: caseItem.description,
            author: caseItem.author,
            hackathonId: caseItem.hackathonId,
        });
        setIsFormOpen(true);
    };

    return (
        <div className="cases-page-container">
            <div className="cases-page-box">
                <h2>Управление кейсами</h2>
                {errors.server && <p className="cases-error-message">{errors.server}</p>}

                {/* Кнопка для создания нового кейса */}
                <button
                    onClick={() => {
                        setEditCase(null);
                        setFormData({ title: '', description: '', author: '', hackathonId: 0 });
                        setIsFormOpen(true);
                    }}
                    className="cases-create-btn"
                >
                    Создать кейс
                </button>

                {/* Форма для создания/редактирования кейса */}
                {isFormOpen && (
                    <div className="cases-form-container">
                        <h3>{editCase ? 'Редактировать кейс' : 'Создать новый кейс'}</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="title"
                                placeholder="Название кейса"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                            <textarea
                                name="description"
                                placeholder="Описание кейса"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="author"
                                placeholder="Компания-спонсор"
                                value={formData.author}
                                onChange={handleInputChange}
                                required
                            />
                            <select
                                name="hackathonId"
                                value={formData.hackathonId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value={0} disabled>
                                    Выберите хакатон
                                </option>
                                {hackathons.map((hackathon) => (
                                    <option key={hackathon.id} value={hackathon.id}>
                                        {hackathon.title}
                                    </option>
                                ))}
                            </select>
                            <div className="form-actions">
                                <button type="submit" className="cases-btn">
                                    {editCase ? 'Сохранить' : 'Создать'}
                                </button>
                                <button
                                    type="button"
                                    className="cases-btn secondary"
                                    onClick={() => setIsFormOpen(false)}
                                >
                                    Отмена
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Список кейсов */}
                <div className="cases-list-group">
                    <h3>Список кейсов</h3>
                    {cases.length === 0 ? (
                        <p>Кейсы не найдены</p>
                    ) : (
                        <ul>
                            {cases.map((caseItem) => (
                                <li key={caseItem.id} className="cases-item">
                                    <div>
                                        <strong>{caseItem.title}</strong>
                                        <p>{caseItem.description}</p>
                                        <p>Компания-спонсор: {caseItem.author}</p>
                                        <p>
                                            Хакатон: {hackathons.find((h) => h.id === caseItem.hackathonId)?.title || 'Не указан'}
                                        </p>
                                    </div>
                                    <div className="cases-actions">
                                        <button
                                            onClick={() => handleEdit(caseItem)}
                                            className="cases-edit-btn"
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            onClick={() => handleDelete(caseItem.id)}
                                            className="cases-delete-btn"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};
