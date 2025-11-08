import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import PageHeader from '../../components/shared/PageHeader';
import OwnerBottomNavigation from '../../layouts/OwnerBottomNavigation';
import Loader from '../../components/Loader';
import ManagerProfile from '../../components/owner/mypage/ManagerProfile';
import { getManagerInfo } from '../../services/managerPage';

const ManagerMyPage = () => {
    const [managerInfo, setManagerInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchManagerInfo = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const response = await getManagerInfo();
            const profileData = response?.data ?? response;
            setManagerInfo(profileData);
        } catch (error) {
            setErrorMessage(
                error?.message ||
                    '매니저 정보를 불러오지 못했습니다.'
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchManagerInfo();
    }, [fetchManagerInfo]);

    return (
        <>
            <PageHeader
                title='매니저 마이페이지'
                showBackButton={false}
            />
            <PageBody>
                {isLoading && (
                    <LoaderWrapper>
                        <Loader />
                    </LoaderWrapper>
                )}
                {!isLoading && errorMessage && (
                    <ErrorCard>
                        <ErrorText>
                            {errorMessage}
                        </ErrorText>
                        <RetryButton
                            type='button'
                            onClick={fetchManagerInfo}
                        >
                            다시 시도
                        </RetryButton>
                    </ErrorCard>
                )}
                {!isLoading &&
                    !errorMessage &&
                    managerInfo && (
                        <ManagerProfile
                            manager={managerInfo}
                        />
                    )}
            </PageBody>
            <OwnerBottomNavigation />
        </>
    );
};

export default ManagerMyPage;

const PageBody = styled.main`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 80px 20px 100px;
    min-height: calc(100vh - 60px);
    background: #f3f6f5;

    @media (max-width: 480px) {
        padding: 72px 16px 90px;
    }
`;

const LoaderWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
`;

const ErrorCard = styled.section`
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #ffe3e3;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    box-shadow: 0 6px 20px rgba(255, 120, 120, 0.1);
`;

const ErrorText = styled.p`
    margin: 0;
    font-family: 'Pretendard';
    font-size: 15px;
    color: #d64545;
    text-align: center;
`;

const RetryButton = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 999px;
    background: #399982;
    color: #ffffff;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
        background: #2f7f6b;
    }

    &:active {
        background: #256857;
    }
`;

