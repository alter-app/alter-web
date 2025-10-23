import ApplicantList from '../../components/owner/applicant/ApplicantList';
import ReputationNotificationList from '../../components/owner/reputation/ReputationNotificationList';
import SentReputationList from '../../components/owner/reputation/SentReputationList';
import WorkplaceList from '../../components/owner/workplace/WorkplaceList';
import OwnerSubstituteRequestSection from '../../components/owner/substituteRequest/OwnerSubstituteRequestSection';
import PageHeader from '../../components/shared/PageHeader';
import OwnerBottomNavigation from '../../layouts/OwnerBottomNavigation';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { getOwnerSubstituteRequests } from '../../services/ownerSubstituteRequest';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';

const Main = () => {
    const [substituteRequests, setSubstituteRequests] =
        useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // 대타 요청 목록 조회 (최근 3개만)
    useEffect(() => {
        const fetchSubstituteRequests = async () => {
            setIsLoading(true);
            try {
                // TODO: 현재 워크스페이스 ID를 가져와야 함
                // 임시로 workspaceId를 1로 설정
                const workspaceId = 1;
                const response =
                    await getOwnerSubstituteRequests(
                        3, // pageSize
                        null, // cursor
                        'ACCEPTED' // status - API에서 조회 가능한 상태 중 하나
                    );
                const requests = response.data?.data || [];
                setSubstituteRequests(requests);
            } catch (error) {
                console.error(
                    '대타 요청 목록 조회 실패:',
                    error
                );
                setSubstituteRequests([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubstituteRequests();
    }, []);

    // 대타 요청 수락
    const handleAccept = async (request) => {
        try {
            // TODO: 대타 요청 수락 API 호출
            console.log('대타 요청 수락:', request);
            // API 호출 후 목록에서 제거하거나 상태 업데이트
        } catch (error) {
            console.error('대타 요청 수락 실패:', error);
        }
    };

    // 대타 요청 거절
    const handleReject = async (request) => {
        try {
            // TODO: 대타 요청 거절 API 호출
            console.log('대타 요청 거절:', request);
            // API 호출 후 목록에서 제거하거나 상태 업데이트
        } catch (error) {
            console.error('대타 요청 거절 실패:', error);
        }
    };

    // 전체 대타 요청 보기
    const handleViewAll = () => {
        navigate('/owner/substitute-requests');
    };

    if (isLoading) {
        return (
            <>
                <PageHeader
                    title='매니저 대시보드'
                    showBackButton={false}
                />
                <LoadingContainer>
                    <Loader />
                </LoadingContainer>
                <OwnerBottomNavigation />
            </>
        );
    }

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
                <SentReputationList />
                <OwnerSubstituteRequestSection
                    substituteRequests={substituteRequests}
                    onViewAllClick={handleViewAll}
                    onAccept={handleAccept}
                    onReject={handleReject}
                />
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

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 180px);
    background-color: #f8f9fa;
    margin-top: 60px;
`;
