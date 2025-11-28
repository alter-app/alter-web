import styled from 'styled-components';
import PageHeader from '../../components/shared/PageHeader';
import BottomNavigation from '../../layouts/BottomNavigation';

const SettingsPage = () => {
    return (
        <>
            <PageHeader title='설정' showBackButton={true} />
            <Container>
                <SettingsContent>
                    <SettingsPlaceholder>
                        설정 페이지 준비 중입니다.
                    </SettingsPlaceholder>
                </SettingsContent>
            </Container>
            <BottomNavigation />
        </>
    );
};

export default SettingsPage;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 80px);
    padding-top: 60px;
    padding-bottom: 80px;

    @media (max-width: 480px) {
        min-height: calc(100vh - 70px);
        padding-bottom: 70px;
    }

    @media (max-width: 360px) {
        min-height: calc(100vh - 60px);
        padding-bottom: 60px;
    }
`;

const SettingsContent = styled.div`
    flex: 1;
    background: #f8f9fa;
    padding: 20px;
`;

const SettingsPlaceholder = styled.div`
    background: #ffffff;
    border-radius: 12px;
    padding: 40px 20px;
    text-align: center;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    color: #999999;
`;

