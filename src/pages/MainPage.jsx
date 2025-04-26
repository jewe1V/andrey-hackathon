import {Outlet, useNavigate} from "react-router-dom";
import '../styles/MainPage.css'

const navigation_List = {
    "Хакатоны": "/main/hackathons",
    "Мой профиль": "/main/profile",
    "Команда": "/main/team",
    "Настройки": "/main/settings",
};

export const MainPage = () => {
    const navigate = useNavigate();

    return (
        <div className="main-page-root">
            <header className="main-page-header">
                    <h1 className="main-page-title">Хакатон G2G4</h1>
                    <div className="main-page-auth-buttons">
                        <button
                            onClick={() => navigate('/login')}
                            className="main-page-auth-button"
                        >
                            Вход
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="main-page-auth-button"
                        >
                            Регистрация
                        </button>
                    </div>
            </header>

            <div className="main-page">
                <div className='sidebar'>
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
                <div style={{width:'1250px'}}>
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}
