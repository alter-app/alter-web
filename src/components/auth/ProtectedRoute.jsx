// 페이지 라우팅 안전장치
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProtectedRoute = ({ children, requiredScope }) => {
    const { isLoggedIn, scope } = useAuthStore();
    const location = useLocation();

    // 로그인 안 한 경우
    if (!isLoggedIn) {
        return <Navigate to='/login' replace />;
    }

    // 매니저인데 허용된 경로 외 접근 시 -> /manager
    if (
        scope === 'MANAGER' &&
        !(
            [
                '/applicant',
                '/posting',
                '/main',
                '/reputation-write',
                '/owner/reputation-write',
                '/owner/sent-reputation',
                '/owner/reputation-notification',
            ].includes(location.pathname) ||
            location.pathname.startsWith(
                '/workplace/detail/'
            ) ||
            location.pathname.startsWith(
                '/owner/workplace/'
            )
        )
    ) {
        return <Navigate to='/main' replace />;
    }

    // APP 권한 체크 (예: requiredScope가 있는 경우)
    if (requiredScope && scope !== requiredScope) {
        return <Navigate to='/job-lookup-map' replace />;
    }

    return children;
};

export default ProtectedRoute;
