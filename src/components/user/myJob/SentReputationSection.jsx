import styled from 'styled-components';
import SectionHeader from './SectionHeader';
import ViewAllButton from './ViewAllButton';
import SentReputationCard from './SentReputationCard';

const SentReputationSection = ({
    sentReputations,
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
                d='M22 2L11 13'
                stroke='#666666'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M22 2L15 22L11 13L2 9L22 2Z'
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
                    title='보낸 평판 요청'
                />
                <CardList>
                    {sentReputations.length > 0 ? (
                        sentReputations.map(
                            (reputation, index) => (
                                <SentReputationCard
                                    key={index}
                                    targetName={
                                        reputation.targetName
                                    }
                                    workplaceName={
                                        reputation.workplaceName
                                    }
                                    timeAgo={
                                        reputation.timeAgo
                                    }
                                    status={
                                        reputation.status
                                    }
                                    statusDescription={
                                        reputation.statusDescription
                                    }
                                    onCancel={() =>
                                        onCancel &&
                                        onCancel(reputation)
                                    }
                                />
                            )
                        )
                    ) : (
                        <EmptyMessage>
                            보낸 평판 요청이 없습니다
                        </EmptyMessage>
                    )}
                </CardList>
                <ViewAllButton onClick={onViewAllClick}>
                    전체 보낸 평판 보기
                </ViewAllButton>
            </SectionCard>
        </Section>
    );
};

export default SentReputationSection;

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
