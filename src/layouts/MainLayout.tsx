import Header from './Header';
import { Outlet, useLocation } from 'react-router-dom';

const MainLayout = () => {
    const location = useLocation();
    const isWebviewPage = [
        '/',
        '/login',
        '/signup',
        '/phoneauth',
        '/user/map',
    ].includes(location.pathname);

    if (isWebviewPage) {
        return <Outlet />;
    }

    return (
        <div>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
