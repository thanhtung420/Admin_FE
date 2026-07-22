import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Layout và Pages
import MainLayout from '../layouts/MainLayout';
import {Dashboard} from '../pages/Dashboard';
import Vocabulary from '../pages/Vocabulary';
import Lesson from '../pages/Lesson';
import User from '../pages/User';
import Question from '../pages/Question';
import Exam from '../pages/Exam';
import ExamBuilder from '../pages/ExamBuilder';
import ExamResults from '../pages/ExamResults';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* 
                  Không cần check token, không cần Login nữa. 
                  Đi thẳng vào MainLayout luôn! 
                */}
                <Route path="/" element={<MainLayout />}>
                    
                    {/* Tự động chuyển hướng / sang /dashboard */}
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    
                    {/* Các trang con ghép vào Outlet */}
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="vocabulary" element={<Vocabulary />} />
                    <Route path="lesson" element={<Lesson />} />
                    <Route path="user" element={<User />} />
                    <Route path="question" element={<Question />} />
                    <Route path="exam" element={<Exam />} />
                    <Route path="exam-builder" element={<ExamBuilder />} />
                    <Route path="exam-results" element={<ExamResults />} />
                </Route>

                {/* Gõ sai link thì về lại trang chủ */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;