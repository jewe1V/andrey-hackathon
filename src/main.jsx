import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css'

import {LoginPage} from "./autorization/LoginPage.jsx";
import {RegisterPage} from "./autorization/RegisterPage.jsx";
import {MainPage} from "./pages/MainPage.jsx";
import {WelcomeSection} from "./pages/WelcomePage.jsx";
import {HackathonUserPage} from "./pages/HackathonUserPage.jsx";


import {AdminMainPage} from "./admin-pages/AdminMainPage.jsx";
import {AdminLoginPage} from "./autorization/AdminLoginPage.jsx";
import {TeamPage} from "./pages/TeamPage.jsx";
import {HackathonPage} from "./admin-pages/HackathonPage.jsx";
import {CasesPage} from "./admin-pages/CasesPage.jsx";
import {ProfilePage} from "./pages/ProfilePage.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
          <Route path="/" element={<WelcomeSection />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />


          <Route path='/main' element={<MainPage/>}>
              <Route index element={<Navigate to="hackathons" />} />
              <Route path="/main/hackathons" element={<HackathonUserPage />} />
              <Route path='/main/team' element={<TeamPage />} />
              <Route path='/main/profile' element={<ProfilePage />} />

          </Route>

          <Route path='/admin/login' element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminMainPage />} >
              <Route index element={<Navigate to="hackathon" />} />
              <Route path="/admin/hackathon" element={<HackathonPage />} />
              <Route path="/admin/cases" element={<CasesPage />} />
          </Route>

      </Routes>

    </Router>
  </StrictMode>,
)
