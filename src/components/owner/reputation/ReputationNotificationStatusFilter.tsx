import styled from 'styled-components';
import { useState } from 'react';

interface ReputationNotificationStatusFilterProps {
    selectedStatuses: string[];
    onStatusChange: (statuses: string[]) => void;
}

const ReputationNotificationStatusFilter = ({
    selectedStatuses,
    onStatusChange,
}: ReputationNotificationStatusFilterProps) => {
    const [isOpen, setIsOpen] = useState(false);

    // 상태별 색상 매핑
    const getStatusColor = (statusValue: string): string => {
        switch (statusValue) {
            case 'REQUESTED':
                return '#2de283';
            case 'COMPLETED':
                return '#3b82f6';
            case 'DECLINED':
                return '#ef4444';
            case 'EXPIRED':
                return '#6b7280';
            case 'CANCELED':
                return '#6b7280';
            default:
                return '#6b7280';
        }
    };

    // 고정된 상태 옵션 정의
    const statusOptions = [
        {
            value: 'REQUESTED',
            label: '요청됨',
            color: getStatusColor('REQUESTED'),
        },
        {
            value: 'COMPLETED',
            label: '완료됨',
            color: getStatusColor('COMPLETED'),
        },
        {
            value: 'DECLINED',
            label: '거절됨',
            color: getStatusColor('DECLINED'),
        },
        {
            value: 'EXPIRED',
            label: '만료됨',
            color: getStatusColor('EXPIRED'),
        },
        {
            value: 'CANCELED',
            label: '취소됨',
            color: getStatusColor('CANCELED'),
        },
    ];

    const handleStatusSelect = (status: string) => {
        // 하나의 상태만 선택 가능
        if (selectedStatuses.includes(status)) {
            // 이미 선택된 상태를 클릭하면 선택 해제
            onStatusChange([]);
        } else {
            // 새로운 상태 선택
            onStatusChange([status]);
        }
    };

    const getSelectedLabels = () => {
        if (selectedStatuses.length === 0) return '전체';
        const selectedOption = statusOptions.find(
            (opt) => opt.value === selectedStatuses[0]
        );
        return selectedOption
            ? selectedOption.label
            : '전체';
    };

    return (
        <FilterContainer>
            <FilterButton
                onClick={() => setIsOpen(!isOpen)}
            >
                <FilterText>
                    {getSelectedLabels()}
                </FilterText>
                <FilterIcon $isOpen={isOpen}>
                    <svg
                        width='16'
                        height='16'
                        viewBox='0 0 24 24'
                        fill='none'
                    >
                        <path
                            d='M6 9L12 15L18 9'
                            stroke='#666666'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        />
                    </svg>
                </FilterIcon>
            </FilterButton>

            {isOpen && (
                <FilterDropdown>
                    <FilterOption
                        onClick={() => onStatusChange([])}
                        $isSelected={
                            selectedStatuses.length === 0
                        }
                    >
                        전체
                    </FilterOption>
                    {statusOptions.map((option) => (
                        <FilterOption
                            key={option.value}
                            onClick={() =>
                                handleStatusSelect(
                                    option.value
                                )
                            }
                            $isSelected={selectedStatuses.includes(
                                option.value
                            )}
                        >
                            <StatusIndicator
                                $color={option.color}
                            />
                            {option.label}
                        </FilterOption>
                    ))}
                </FilterDropdown>
            )}
        </FilterContainer>
    );
};

export default ReputationNotificationStatusFilter;

const FilterContainer = styled.div`
    position: relative;
    width: 100%;
    margin-bottom: 16px;
`;

const FilterButton = styled.button`
    width: 100%;
    padding: 12px 16px;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: #2de283;
        box-shadow: 0 2px 8px rgba(45, 226, 131, 0.1);
    }

    &:focus {
        outline: none;
        border-color: #2de283;
        box-shadow: 0 0 0 3px rgba(45, 226, 131, 0.1);
    }
`;

const FilterText = styled.span`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #333333;
    flex: 1;
    text-align: left;
`;

interface FilterIconProps {
    $isOpen?: boolean;
}

const FilterIcon = styled.div<FilterIconProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
    transform: ${(props) =>
        props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const FilterDropdown = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    max-height: 200px;
    overflow-y: auto;
    margin-top: 4px;
`;

interface FilterOptionProps {
    $isSelected?: boolean;
}

const FilterOption = styled.div<FilterOptionProps>`
    padding: 12px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: ${(props) =>
        props.$isSelected ? '#2de283' : '#333333'};
    background: ${(props) =>
        props.$isSelected ? '#f0fdf4' : 'transparent'};
    transition: all 0.2s ease;

    &:hover {
        background: ${(props) =>
            props.$isSelected ? '#f0fdf4' : '#f8f9fa'};
    }

    &:first-child {
        border-radius: 8px 8px 0 0;
    }

    &:last-child {
        border-radius: 0 0 8px 8px;
    }
`;

interface StatusIndicatorProps {
    $color?: string;
}

const StatusIndicator = styled.div<StatusIndicatorProps>`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(props) => props.$color || '#6b7280'};
    flex-shrink: 0;
`;

