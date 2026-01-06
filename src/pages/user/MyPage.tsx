import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { getUserInfo } from '../../services/myPage';
import UserProfile from '../../components/user/mypage/UserProfile';
import CertificateList from '../../components/user/mypage/CertificateList';
import ScrappedPostList from '../../components/user/mypage/ScrappedPostList';
import BottomNavigation from '../../layouts/BottomNavigation';
import PageHeader from '../../components/shared/PageHeader';

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
            <PageHeader
                title='마이페이지'
                showBackButton={false}
            />
            <ContainerColumn>
                <UserProfile />
                <TabContainer>
                    <Tab
                        $active={activeTab === 'scrap'}
                        onClick={() =>
                            setActiveTab('scrap')
                        }
                    >
                        저장한 공고
                    </Tab>
                    <Tab
                        $active={
                            activeTab === 'certificate'
                        }
                        onClick={() =>
                            setActiveTab('certificate')
                        }
                    >
                        자격사항 관리
                    </Tab>
                </TabContainer>
                <TabPanel>
                    <ScrappedPostList
                        isActive={activeTab === 'scrap'}
                    />
                    <CertificateList
                        isActive={
                            activeTab === 'certificate'
                        }
                    />
                </TabPanel>
            </ContainerColumn>
            <BottomNavigation />
        </>
    );
};

export default MyPage;

const ContainerColumn = styled.div`
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

const TabContainer = styled.div`
    display: flex;
    width: 100%;
    background: #ffffff;
    border-bottom: 1px solid #e0e0e0;
`;

const Tab = styled.button`
    flex: 1;
    padding: 16px 0;
    background: none;
    border: none;
    color: ${({ $active }) =>
        $active ? '#2de283' : '#999999'};
    font-size: 16px;
    font-weight: ${({ $active }) => ($active ? 600 : 400)};
    font-family: 'Pretendard';
    border-bottom: 2px solid
        ${({ $active }) =>
            $active ? '#2de283' : 'transparent'};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        color: #2de283;
    }
`;

const TabPanel = styled.div`
    flex: 1;
    background: #f8f9fa;
    min-height: 0;
`;
