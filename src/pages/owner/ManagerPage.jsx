import styled from 'styled-components';
import PostingsApplicationsList from '../../components/owner/PostingsApplicationsList';

const ManagerPage = () => {
    return (
        <Column>
            <Title>지원자 상태 관리</Title>
            <PostingsApplicationsList />
        </Column>
    );
};

export default ManagerPage;

const Title = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 34px;
    line-height: 48px;
    padding: 30px 0px;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
