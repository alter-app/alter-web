import styled from 'styled-components';
import ReputationNotificationItem from './ReputationNotificationItem';
import { useState, useEffect } from 'react';
import { getReputationRequestList } from '../../../services/mainPageService';

const ReputationNotificationList = () => {
    const [reputationRequest, setReputationRequest] =
        useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await getReputationRequestList(
                3
            );
            setReputationRequest(result.data);
            console.log(result.data);
        } catch (error) {
            console.error(
                '평판 요청 목록 조회 오류:',
                error
            );
        }
    };

    return (
        <SectionContainer>
            <SectionHeader>
                <SectionTitle>평판 알림</SectionTitle>
                <ViewAllButton>전체보기</ViewAllButton>
            </SectionHeader>
            {reputationRequest.length > 0 ? (
                <CardList>
                    {reputationRequest
                        .slice(0, 3)
                        .map((item) => (
                            <ReputationNotificationItem
                                key={item.id}
                                {...item}
                            />
                        ))}
                </CardList>
            ) : (
                <EmptyMessage>
                    알림이 없습니다.
                </EmptyMessage>
            )}
        </SectionContainer>
    );
};

export default ReputationNotificationList;

const SectionContainer = styled.div`
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    border: 1px solid #e9ecef;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

const SectionTitle = styled.h3`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 18px;
    color: #333333;
    margin: 0;
`;

const ViewAllButton = styled.button`
    background: none;
    border: none;
    color: #666666;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
`;

const CardList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const EmptyMessage = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    text-align: center;
    padding: 20px 0;
`;
