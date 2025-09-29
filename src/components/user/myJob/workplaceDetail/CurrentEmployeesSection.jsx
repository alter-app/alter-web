import styled from 'styled-components';
import EmployeeCard from './EmployeeCard';

const CurrentEmployeesSection = ({
    employees,
    hasMore = false,
    isLoadingMore = false,
    onLoadMore = null,
    showAllEmployees = false,
    onToggleShowAll = null,
}) => {
    console.log('CurrentEmployeesSection 렌더링:', {
        employeesCount: employees.length,
        employees: employees,
        hasMore,
        isLoadingMore,
        showAllEmployees,
    });

    // 표시할 직원 목록 결정 (3명 이상일 때만 제한)
    const shouldShowToggle = employees.length > 3;
    const displayEmployees =
        shouldShowToggle && !showAllEmployees
            ? employees.slice(0, 3)
            : employees;
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
                        현재 근무 중 ({employees.length}명)
                        {shouldShowToggle &&
                            !showAllEmployees && (
                                <span
                                    style={{
                                        color: '#666',
                                        fontSize: '14px',
                                        fontWeight: '400',
                                    }}
                                >
                                    {' '}
                                    (
                                    {
                                        displayEmployees.length
                                    }
                                    명 표시)
                                </span>
                            )}
                    </Title>
                </HeaderLeft>
            </SectionHeader>

            <EmployeeList>
                {displayEmployees.length === 0 ? (
                    <EmptyMessage>
                        <EmptyIcon>👥</EmptyIcon>
                        <EmptyText>
                            현재 근무 중인 직원이 없습니다.
                        </EmptyText>
                    </EmptyMessage>
                ) : (
                    displayEmployees.map(
                        (employee, index) => {
                            console.log(
                                `근무자 ${
                                    index + 1
                                } 렌더링:`,
                                employee
                            );
                            return (
                                <EmployeeCard
                                    key={
                                        employee.id || index
                                    }
                                    employee={employee}
                                />
                            );
                        }
                    )
                )}
            </EmployeeList>

            {hasMore && (
                <LoadMoreButton
                    onClick={onLoadMore}
                    disabled={isLoadingMore}
                >
                    {isLoadingMore
                        ? '로딩 중...'
                        : '더보기'}
                </LoadMoreButton>
            )}

            {shouldShowToggle && (
                <ToggleButton onClick={onToggleShowAll}>
                    {showAllEmployees
                        ? '간략히 보기'
                        : '전체보기'}
                </ToggleButton>
            )}
        </Section>
    );
};

export default CurrentEmployeesSection;

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

const RealTimeTag = styled.div`
    padding: 4px 8px;
    background: #e8f5e8;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 12px;
    color: #2e7d32;
`;

const EmployeeList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const LoadMoreButton = styled.button`
    width: 100%;
    padding: 12px 16px;
    margin-top: 16px;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #666666;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        background: #f8f9fa;
        border-color: #d0d0d0;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
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

const ToggleButton = styled.button`
    width: 100%;
    padding: 12px 16px;
    margin-top: 12px;
    background: #f8f9fa;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #1976d2;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #e3f2fd;
        border-color: #1976d2;
    }
`;
