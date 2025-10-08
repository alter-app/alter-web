import styled from 'styled-components';
import { useState } from 'react';

const StatusFilter = ({ selectedStatuses, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const statusOptions = [
        {
            value: 'SUBMITTED',
            label: '제출됨',
            color: '#666666',
        },
        {
            value: 'SHORTLISTED',
            label: '서류 통과',
            color: '#ffa726',
        },
        {
            value: 'ACCEPTED',
            label: '수락됨',
            color: '#2de283',
        },
        {
            value: 'REJECTED',
            label: '거절됨',
            color: '#ff4444',
        },
        {
            value: 'CANCELLED',
            label: '지원 취소',
            color: '#999999',
        },
        {
            value: 'EXPIRED',
            label: '기간 만료',
            color: '#999999',
        },
    ];

    const handleStatusToggle = (status) => {
        const newStatuses = selectedStatuses.includes(status)
            ? selectedStatuses.filter((s) => s !== status)
            : [...selectedStatuses, status];
        onStatusChange(newStatuses);
    };

    const getSelectedLabels = () => {
        if (selectedStatuses.length === 0) return '전체';
        if (selectedStatuses.length === statusOptions.length) return '전체';
        return selectedStatuses
            .map(
                (status) =>
                    statusOptions.find((opt) => opt.value === status)?.label
            )
            .join(', ');
    };

    return (
        <FilterContainer>
            <FilterButton onClick={() => setIsOpen(!isOpen)}>
                <FilterText>{getSelectedLabels()}</FilterText>
                <FilterIcon $isOpen={isOpen}>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
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
                        $isSelected={selectedStatuses.length === 0}
                    >
                        전체
                    </FilterOption>
                    {statusOptions.map((option) => (
                        <FilterOption
                            key={option.value}
                            onClick={() => handleStatusToggle(option.value)}
                            $isSelected={selectedStatuses.includes(
                                option.value
                            )}
                        >
                            <StatusIndicator $color={option.color} />
                            {option.label}
                        </FilterOption>
                    ))}
                </FilterDropdown>
            )}
        </FilterContainer>
    );
};

export default StatusFilter;

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

const FilterIcon = styled.div`
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

const FilterOption = styled.div`
    padding: 12px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: ${(props) => (props.$isSelected ? '#2de283' : '#333333')};
    background: ${(props) => (props.$isSelected ? '#f0fdf4' : 'transparent')};
    transition: all 0.2s ease;

    &:hover {
        background: ${(props) => (props.$isSelected ? '#f0fdf4' : '#f8f9fa')};
    }

    &:first-child {
        border-radius: 8px 8px 0 0;
    }

    &:last-child {
        border-radius: 0 0 8px 8px;
    }
`;

const StatusIndicator = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(props) => props.$color};
    flex-shrink: 0;
`;
