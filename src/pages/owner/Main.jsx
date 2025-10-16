import ApplicantList from '../../components/owner/applicant/ApplicantList';
import ReputationNotificationList from '../../components/owner/reputation/ReputationNotificationList';
import WorkplaceList from '../../components/owner/workplace/WorkplaceList';
import PageHeader from '../../components/shared/PageHeader';
import OwnerBottomNavigation from '../../layouts/OwnerBottomNavigation';
import styled from 'styled-components';

const Main = () => {
    return (
        <>
            <PageHeader
                title='매니저 대시보드'
                showBackButton={false}
            />
            <MainContentWrapper>
                <WorkplaceList />
                <ApplicantList />
                <ReputationNotificationList />
            </MainContentWrapper>
            <OwnerBottomNavigation />
        </>
    );
};

export default Main;

const MainContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 20px;
    min-height: calc(100vh - 180px);
    background-color: #f8f9fa;
    margin-top: 60px;
    padding-bottom: 80px;
`;
