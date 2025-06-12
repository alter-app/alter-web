import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { loginWithProvider } from '../../services/auth';
import Loader from '../../components/Loader';
export default function KakaoCallback() {
    const navigate = useNavigate();
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        if (code) {
            loginWithProvider(
                'KAKAO',
                code,
                setAuth,
                navigate
            );
        }
    }, [code, navigate, setAuth]);

    return (
        <div>
            <Loader />
        </div>
    );
}
