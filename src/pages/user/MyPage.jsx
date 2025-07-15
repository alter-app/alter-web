import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { getUserInfo } from '../../services/myPage';
import UserProfile from '../../components/user/mypage/UserProfile';
import CertificateList from '../../components/user/mypage/CertificateList';
import ApplicationList from '../../components/user/mypage/ApplicationList';
import ScrappedPostList from '../../components/user/mypage/ScrappedPostList';

const MyPage = () => {
    const [userInfo, setUserInfo] = useState([]);
    const [activeTab, setActiveTab] = useState('scrap');

    // 사용자 정보 조회 요청
    useEffect(() => {
        const fetchUserInfo = async () => {
            const result = await getUserInfo();
            setUserInfo(result.data);
        };
        fetchUserInfo();
        console.log(userInfo);
    }, []);

    return (
        <>
            <ContainerColumn>
                <UserProfile />
                <CertificateList />
                <TabContainer>
                    <Tab
                        $active={activeTab === 'scrap'}
                        onClick={() =>
                            setActiveTab('scrap')
                        }
                    >
                        스크랩 리스트
                    </Tab>
                    <Tab
                        $active={activeTab === 'apply'}
                        onClick={() =>
                            setActiveTab('apply')
                        }
                    >
                        지원 리스트
                    </Tab>
                </TabContainer>
                <TabPanel>
                    {activeTab === 'scrap' && (
                        <ScrappedPostList />
                    )}
                    {activeTab === 'apply' && (
                        <ApplicationList />
                    )}
                </TabPanel>
            </ContainerColumn>
        </>
    );
};

export default MyPage;

const ContainerColumn = styled.div`
    display: flex;
    flex-direction: column;
`;

const TabContainer = styled.div`
    display: flex;
    width: 50vw;
    margin-top: 30px;
`;

const Tab = styled.button`
    flex: 1;
    padding: 16px 0;
    background: none;
    border: none;
    color: ${({ $active }) =>
        $active ? '#2de283' : '#999999'};
    font-size: 20px;
    font-weight: ${({ $active }) => ($active ? 700 : 400)};
    border-bottom: 2px solid
        ${({ $active }) =>
            $active ? ' #2de283' : '#999999'};
    cursor: pointer;
`;

const TabPanel = styled.div`
    padding: 24px 0;
`;
