import ApplicantList from '../../components/owner/applicant/ApplicantList';
import ReputationNotificationList from '../../components/owner/reputation/ReputationNotificationList';
import WorkplaceList from '../../components/owner/workplace/workplaceList';
import styled from 'styled-components';

const Main = () => {
    return (
        <MainContentWrapper>
            <WorkplaceList />
            <ApplicantList />
            <ReputationNotificationList />
        </MainContentWrapper>
    );
};

export default Main;

const MainContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 50px;
    padding-left: 4vw;
    padding-top: 5vh;
    padding-bottom: 5vh;
`;
