import styled from 'styled-components';
import SentSubstituteRequestCard from './SentSubstituteRequestCard';

const SentSubstituteRequestSection = ({
    sentSubstituteRequests,
    onViewAllClick,
    onCancel,
}) => {
    const sendIcon = (
        <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
        >
            <path
                d='M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13'
                stroke='#666666'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg>
    );

    return (
        <Section>
            <SectionCard>
                <SectionHeader
                    icon={sendIcon}
                    title='보낸 대타 요청'
                />
                <CardList>
                    {sentSubstituteRequests.length > 0 ? (
                        sentSubstituteRequests.map(
                            (request, index) => (
                                <SentSubstituteRequestCard
                                    key={index}
                                    workspaceName={
                                        request.workspaceName
                                    }
                                    scheduleDate={
                                        request.scheduleDate
                                    }
                                    scheduleTime={
                                        request.scheduleTime
                                    }
                                    position={
                                        request.position
                                    }
                                    timeAgo={
                                        request.timeAgo
                                    }
                                    status={request.status}
                                    statusDescription={
                                        request.statusDescription
                                    }
                                    onCancel={() =>
                                        onCancel &&
                                        onCancel(request)
                                    }
                                />
                            )
                        )
                    ) : (
                        <EmptyMessage>
                            보낸 대타 요청이 없습니다
                        </EmptyMessage>
                    )}
                </CardList>
                <ViewAllButton onClick={onViewAllClick}>
                    전체 보낸 대타 요청 보기
                </ViewAllButton>
            </SectionCard>
        </Section>
    );
};

export default SentSubstituteRequestSection;

const Section = styled.div`
    margin-bottom: 30px;
`;

const SectionCard = styled.div`
    background: #ffffff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f0f0;
`;

const SectionHeader = ({ icon, title }) => (
    <HeaderContainer>
        <HeaderLeft>
            <IconWrapper>{icon}</IconWrapper>
            <Title>{title}</Title>
        </HeaderLeft>
    </HeaderContainer>
);

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Title = styled.h3`
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
    margin-bottom: 16px;
`;

const EmptyMessage = styled.div`
    padding: 40px 20px;
    text-align: center;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #999999;
    background: #f8f9fa;
    border-radius: 12px;
`;

const ViewAllButton = styled.button`
    width: 100%;
    padding: 12px;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #666666;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #e9ecef;
        border-color: #dee2e6;
    }

    &:active {
        transform: scale(0.98);
    }
`;
