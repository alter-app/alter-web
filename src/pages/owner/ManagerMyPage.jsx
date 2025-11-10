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
                title='마이페이지'
                showBackButton={false}
            />
            <ContainerColumn>
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
            </ContainerColumn>
            <OwnerBottomNavigation />
        </>
    );
};

export default ManagerMyPage;

const ContainerColumn = styled.div`
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 80px);
    padding-top: 60px;
    padding-bottom: 80px;
    background: #f8f9fa;

    @media (max-width: 480px) {
        min-height: calc(100vh - 70px);
        padding-bottom: 70px;
    }

    @media (max-width: 360px) {
        min-height: calc(100vh - 60px);
        padding-bottom: 60px;
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

const KebabButton = styled.button`
    position: fixed;
    top: 12px;
    right: 16px;
    z-index: 110;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 12px;
    background: rgba(17, 17, 17, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
    -webkit-tap-highlight-color: transparent;

    &:hover {
        background: rgba(17, 17, 17, 0.08);
    }

    &:active {
        background: rgba(17, 17, 17, 0.12);
        transform: scale(0.94);
    }

    @supports (padding: max(0px)) {
        top: calc(12px + env(safe-area-inset-top));
    }

    @media (max-width: 480px) {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        right: 14px;
    }

    @media (max-width: 360px) {
        width: 32px;
        height: 32px;
        border-radius: 10px;
        right: 12px;
    }
`;

const KebabDots = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;

    span {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #111111;
    }

    @media (max-width: 480px) {
        gap: 3px;

        span {
            width: 3px;
            height: 3px;
        }
    }
`;

const VisuallyHidden = styled.span`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
`;
