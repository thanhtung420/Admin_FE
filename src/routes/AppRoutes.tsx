import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Layout và Pages
import MainLayout from '../layouts/MainLayout';
import Lesson from '../pages/Lesson';
import User from '../pages/User';
import Question from '../pages/Question';
import { Login } from '../pages/Login';
import Topic from '../pages/Topic';

// Component bảo vệ: Nếu chưa có token thì đá về /login
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Trang Login độc lập */}
                <Route path="/login" element={<Login />} />

                {/* Các trang quản trị được bảo vệ bởi ProtectedRoute */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="/lesson" replace />} />

                    <Route path="lesson" element={<Lesson />} />
                    <Route path="user" element={<User />} />
                    <Route path="question" element={<Question />} />
                    <Route path="topic" element={<Topic />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;