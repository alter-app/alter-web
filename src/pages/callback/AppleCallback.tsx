import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { loginWithProvider } from '../../services/auth';
import Loader from '../../components/Loader';
import styled from 'styled-components';

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
        <Container>
            <Loader />
        </Container>
    );
}

export default AppleCallback;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
