import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    getSentReputationRequests,
    cancelReputationRequest,
} from '../../../services/managerPage';
import { timeAgo } from '../../../utils/timeUtil';
import SentReputationCard from '../../user/myJob/SentReputationCard';

const SentReputationList = ({ limit = 3 }) => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const result =
                    await getSentReputationRequests({
                        cursorInfo: '',
                        status: ['REQUESTED'],
                        pageSize: limit,
                    });
                setRequests(result.data || []);
            } catch (error) {
                console.error(
                    '보낸 평판 요청 조회 오류:',
                    error
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, [limit]);

    const handleCancelRequest = async (request) => {
        try {
            console.log('보낸 평판 취소:', request);
            await cancelReputationRequest(request.id);

            // 최신 데이터 다시 가져오기
            const result = await getSentReputationRequests({
                cursorInfo: '',
                status: ['REQUESTED'],
                pageSize: limit,
            });
            setRequests(result.data || []);
        } catch (error) {
            console.error('보낸 평판 취소 오류:', error);
            alert('평판 취소 중 오류가 발생했습니다.');
        }
    };

    const handleViewAll = () => {
        navigate('/owner/sent-reputation');
    };

    if (isLoading) {
        return (
            <Section>
                <SectionCard>
                    <SectionHeader>
                        <HeaderTitle>
                            보낸 평판 요청
                        </HeaderTitle>
                    </SectionHeader>
                    <LoadingText>로딩 중...</LoadingText>
                </SectionCard>
            </Section>
        );
    }

    return (
        <Section>
            <SectionCard>
                <SectionHeader>
                    <HeaderTitle>
                        보낸 평판 요청
                    </HeaderTitle>
                    <ViewAllText onClick={handleViewAll}>
                        전체보기
                    </ViewAllText>
                </SectionHeader>

                <CardList>
                    {requests.length > 0 ? (
                        requests.map((request) => (
                            <SentReputationCard
                                key={request.id}
                                targetName={
                                    request.target?.name ||
                                    '알 수 없음'
                                }
                                workplaceName={
                                    request.requester
                                        ?.name ||
                                    '업장 정보 없음'
                                }
                                timeAgo={timeAgo(
                                    request.createdAt
                                )}
                                status={
                                    request.status.value
                                }
                                statusDescription={
                                    request.status
                                        .description
                                }
                                onCancel={() =>
                                    handleCancelRequest(
                                        request
                                    )
                                }
                            />
                        ))
                    ) : (
                        <EmptyMessage>
                            보낸 평판 요청이 없습니다
                        </EmptyMessage>
                    )}
                </CardList>
            </SectionCard>
        </Section>
    );
};

export default SentReputationList;

const Section = styled.div``;

const SectionCard = styled.div`
    background: #ffffff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f0f0;
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

const HeaderIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const HeaderTitle = styled.h3`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 18px;
    color: #333333;
    margin: 0;
`;

const CardList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 16px;
`;

const EmptyMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 20px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #999999;
    text-align: center;
`;

const LoadingText = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #999999;
`;

const ViewAllText = styled.button`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #666666;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
    transition: all 0.2s ease;

    &:hover {
        color: #2de283;
    }

    &:active {
        transform: scale(0.98);
    }
`;
