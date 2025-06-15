import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { loginWithProvider } from '../../services/auth';
import Loader from '../../components/Loader';

function AppleCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const { authorizationCode, userType } =
        location.state || {};
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        if (authorizationCode && userType) {
            loginWithProvider(
                'APPLE',
                authorizationCode,
                setAuth,
                navigate,
                userType
            );
        }
    }, [authorizationCode, navigate, setAuth, userType]);

    return (
        <div>
            <Loader />
        </div>
    );
}

export default AppleCallback;
