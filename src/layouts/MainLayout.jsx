import Header from './Header';
import { Outlet, useLocation } from 'react-router-dom';

const MainLayout = () => {
    const location = useLocation();
    const isAuthPage = ['/login', '/signup', '/phoneauth'].includes(location.pathname);

    if (isAuthPage) {
        return <Outlet />;
    }

    return (
        <div>
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
