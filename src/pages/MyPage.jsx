import ApplicationList from '../components/mypage/ApplicationList';
import ScrappedPostList from '../components/mypage/ScrappedPostList';
import styled from 'styled-components';

const MyPage = () => {
    return (
        <>
            <Column>
                <Title>스크랩 리스트</Title>
                <ScrappedPostList />
            </Column>
            <Column>
                <Title>지원 리스트</Title>
                <ApplicationList />
            </Column>
        </>
    );
};

export default MyPage;

const Title = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 32px;
    line-height: 42px;
    color: #111111;
    margin-top: 60px;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
