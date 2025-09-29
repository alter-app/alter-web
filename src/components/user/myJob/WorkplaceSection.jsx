import styled from 'styled-components';
import SectionHeader from './SectionHeader';
import WorkplaceCard from './WorkplaceCard';

const WorkplaceSection = ({
    workplaces,
    onWorkplaceClick,
}) => {
    const documentIcon = (
        <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
        >
            <path
                d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'
                stroke='#666666'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <polyline
                points='14,2 14,8 20,8'
                stroke='#666666'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <line
                x1='16'
                y1='13'
                x2='8'
                y2='13'
                stroke='#666666'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <line
                x1='16'
                y1='17'
                x2='8'
                y2='17'
                stroke='#666666'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <polyline
                points='10,9 9,9 8,9'
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
                    icon={documentIcon}
                    title='근무 중인 업장'
                />
                <CardList>
                    {workplaces.length > 0 ? (
                        workplaces.map(
                            (workplace, index) => (
                                <WorkplaceCard
                                    key={index}
                                    workplaceName={
                                        workplace.name
                                    }
                                    status={
                                        workplace.status
                                    }
                                    position={
                                        workplace.position
                                    }
                                    wage={workplace.wage}
                                    nextShift={
                                        workplace.nextShift
                                    }
                                    onClick={() =>
                                        onWorkplaceClick &&
                                        onWorkplaceClick(
                                            workplace
                                        )
                                    }
                                />
                            )
                        )
                    ) : (
                        <EmptyMessage>
                            근무 중인 업장이 없습니다
                        </EmptyMessage>
                    )}
                </CardList>
            </SectionCard>
        </Section>
    );
};

export default WorkplaceSection;

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
