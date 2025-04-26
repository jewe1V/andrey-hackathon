import {Outlet, useNavigate} from "react-router-dom";
import '../styles/MainPage.css'

const navigation_List = {
    "Управление хакатонами": "/admin/hackathon",
    "Управление кейсами": "/admin/cases",
    "Обзор": "/admin/review",
    "Настройки": "/admin/settings",
};

export const AdminMainPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const handleLogout = () => {
        localStorage.removeItem('token'); // Удаляем токен
        navigate('/admin/login'); // Перенаправляем на страницу логина
    };

    return (
        <div className="main-page-root">
            <header className="main-page-header">
                <h1 className="main-page-title">Хакатон G2G4</h1>
                <div className="main-page-auth-buttons">
                    {token ? (
                        <button
                            onClick={handleLogout}
                            className="main-page-auth-button logout"
                        >
                            Выход
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/admin/login')}
                                className="main-page-auth-button"
                            >
                                Вход
                            </button>
                        </>
                    )}
                </div>
            </header>

            <div className="main-page">
                <div className="sidebar">
                    <div className="navigation">
                        {Object.entries(navigation_List).map(([title, path]) => (
                            <button
                                key={path}
                                onClick={() => navigate(path)}
                                className="nav-link"
                            >
                                {title}
                            </button>
                        ))}
                    </div>
                </div>
                <div style={{ width: '1250px' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
