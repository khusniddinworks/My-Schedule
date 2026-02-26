import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';

const Layout = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-6xl mx-auto w-full">
                <Outlet />
            </main>
            <MobileNav />
        </div>
    );
};

export default Layout;
