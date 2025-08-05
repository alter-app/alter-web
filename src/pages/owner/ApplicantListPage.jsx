import styled from 'styled-components';
import AllApplicantList from '../../components/owner/applicant/AllApplicantList';

const ApplicantListPage = () => {
    return (
        <Column>
            <Title>지원자 목록</Title>
            <AllApplicantList />
        </Column>
    );
};

export default ApplicantListPage;

const Title = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 34px;
    line-height: 48px;
    padding-bottom: 30px;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px 0;
`;
