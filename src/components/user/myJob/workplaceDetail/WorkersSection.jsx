import styled from 'styled-components';
import EmployeeCard from './EmployeeCard';

const WorkersSection = ({ workers }) => {
    console.log('WorkersSection 렌더링:', {
        workersCount: workers.length,
        workers: workers,
    });

    const clockIcon = (
        <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
        >
            <circle
                cx='12'
                cy='12'
                r='10'
                stroke='#666666'
                strokeWidth='2'
            />
            <polyline
                points='12,6 12,12 16,14'
                stroke='#666666'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg>
    );

    return (
        <Section>
            <SectionHeader>
                <HeaderLeft>
                    <IconWrapper>{clockIcon}</IconWrapper>
                    <Title>
                        근무자 ({workers.length}명)
                    </Title>
                </HeaderLeft>
            </SectionHeader>

            <EmployeeList>
                {workers.length === 0 ? (
                    <EmptyMessage>
                        <EmptyIcon>👥</EmptyIcon>
                        <EmptyText>
                            현재 근무 중인 직원이 없습니다.
                        </EmptyText>
                    </EmptyMessage>
                ) : (
                    workers.map((worker, index) => {
                        console.log(
                            `근무자 ${index + 1} 렌더링:`,
                            worker
                        );
                        return (
                            <EmployeeCard
                                key={worker.id || index}
                                employee={worker}
                            />
                        );
                    })
                )}
            </EmployeeList>
        </Section>
    );
};

export default WorkersSection;

const Section = styled.div`
    margin-bottom: 30px;
`;

const SectionHeader = styled.div`
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
    font-size: 16px;
    color: #333333;
    margin: 0;
`;

const EmployeeList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const EmptyMessage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    gap: 12px;
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #f0f0f0;
`;

const EmptyIcon = styled.span`
    font-size: 48px;
    opacity: 0.6;
`;

const EmptyText = styled.span`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    color: #666666;
    text-align: center;
`;
