import styled from 'styled-components';
import EmployeeCard from './EmployeeCard';

const ManagersSection = ({ managers }) => {
    console.log('ManagersSection 렌더링:', {
        managersCount: managers.length,
        managers: managers,
    });

    const crownIcon = (
        <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
            <path
                d='M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z'
                stroke='#FFA726'
                strokeWidth='2'
                fill='#FFA726'
            />
        </svg>
    );

    return (
        <Section>
            <SectionHeader>
                <HeaderLeft>
                    <IconWrapper>{crownIcon}</IconWrapper>
                    <Title>관리자 ({managers.length}명)</Title>
                </HeaderLeft>
            </SectionHeader>

            <EmployeeList>
                {managers.length === 0 ? (
                    <EmptyMessage>
                        <EmptyIcon>👑</EmptyIcon>
                        <EmptyText>점주/매니저 정보가 없습니다.</EmptyText>
                    </EmptyMessage>
                ) : (
                    managers.map((manager, index) => {
                        console.log(
                            `점주/매니저 ${index + 1} 렌더링:`,
                            manager
                        );
                        return (
                            <EmployeeCard
                                key={manager.id || index}
                                employee={manager}
                            />
                        );
                    })
                )}
            </EmployeeList>
        </Section>
    );
};

export default ManagersSection;

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
