import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { loginWithProvider } from '../../services/auth';
import Loader from '../../components/Loader';

function AppleCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const { authorizationCode } = location.state || {};
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        if (authorizationCode) {
            loginWithProvider(
                'APPLE',
                authorizationCode,
                setAuth,
                navigate
            );
        }
    }, [authorizationCode, navigate, setAuth]);

    return (
        <div>
            <Loader />
        </div>
    );
}

export default AppleCallback;
