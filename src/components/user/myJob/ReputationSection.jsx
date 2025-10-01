import styled from 'styled-components';
import SectionHeader from './SectionHeader';
import ReputationCard from './ReputationCard';
import ViewAllButton from './ViewAllButton';

const ReputationSection = ({
    reputations,
    onViewAllClick,
    onAccept,
    onReject,
}) => {
    const bellIcon = (
        <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
            <path
                d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9'
                stroke='#666666'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M13.73 21a2 2 0 0 1-3.46 0'
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
                <SectionHeader icon={bellIcon} title='받은 평판 요청' />
                <CardList>
                    {reputations.length > 0 ? (
                        reputations.map((reputation, index) => (
                            <ReputationCard
                                key={index}
                                workplaceName={reputation.workplaceName}
                                reviewerName={reputation.reviewerName}
                                timeAgo={reputation.timeAgo}
                                rating={reputation.rating}
                                isNew={reputation.isNew}
                                onAccept={() =>
                                    onAccept && onAccept(reputation)
                                }
                                onReject={() =>
                                    onReject && onReject(reputation)
                                }
                            />
                        ))
                    ) : (
                        <EmptyMessage>받은 평판 요청이 없습니다</EmptyMessage>
                    )}
                </CardList>
                <ViewAllButton onClick={onViewAllClick}>
                    전체 평판 보기
                </ViewAllButton>
            </SectionCard>
        </Section>
    );
};

export default ReputationSection;

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
