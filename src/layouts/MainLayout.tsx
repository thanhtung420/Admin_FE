import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; // Import Header mới

const MainLayout = () => {
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            
            {/* Thanh menu bên trái */}
            <Sidebar />
            
            {/* Khu vực bên phải */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                
                {/* Thanh Header nằm trên cùng */}
                <Header />
                
                {/* Khu vực chứa nội dung các trang (có thanh cuộn riêng) */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    <Outlet />
                </main>
                
            </div>
            
        </div>
    );
};

export default MainLayout;