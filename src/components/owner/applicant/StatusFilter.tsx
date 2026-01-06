import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import dropdownIcon from '../../../assets/icons/dropdown.svg';

interface Workplace {
    id: string | number;
    businessName?: string;
    [key: string]: unknown;
}

interface StatusFilterProps {
    selectedStatus: string;
    onStatusChange: (status: string) => void;
    selectedWorkplace: string | number | null;
    onWorkplaceChange: (workplaceId: string | number | null) => void;
    workplaceList: Workplace[];
    totalCount: number;
}

const StatusFilter = ({
    selectedStatus,
    onStatusChange,
    selectedWorkplace,
    onWorkplaceChange,
    workplaceList,
    totalCount,
}: StatusFilterProps) => {
    const [isWorkplaceOpen, setIsWorkplaceOpen] =
        useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const workplaceRef = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);

    const statusOptions = [
        { value: '', label: '전체 상태' },
        { value: 'SUBMITTED', label: '제출됨' },
        { value: 'SHORTLISTED', label: '서류 통과' },
        { value: 'ACCEPTED', label: '수락됨' },
        { value: 'REJECTED', label: '거절됨' },
        { value: 'CANCELLED', label: '지원 취소' },
        { value: 'EXPIRED', label: '기간 만료' },
        { value: 'DELETED', label: '삭제됨' },
    ];

    // 현재 선택된 값의 라벨 찾기
    const getSelectedWorkplaceLabel = () => {
        const workplace = workplaceList.find(
            (w: Workplace) => w.id === selectedWorkplace
        );
        return workplace
            ? workplace.businessName
            : '전체 업장';
    };

    const getSelectedStatusLabel = () => {
        const status = statusOptions.find(
            (s) => s.value === selectedStatus
        );
        return status ? status.label : '전체 상태';
    };

    // 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                workplaceRef.current &&
                event.target instanceof Node &&
                !workplaceRef.current.contains(event.target)
            ) {
                setIsWorkplaceOpen(false);
            }
            if (
                statusRef.current &&
                event.target instanceof Node &&
                !statusRef.current.contains(event.target)
            ) {
                setIsStatusOpen(false);
            }
        };

        document.addEventListener(
            'mousedown',
            handleClickOutside
        );
        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };
    }, []);

    const handleWorkplaceSelect = (workplaceId: string | number) => {
        onWorkplaceChange(workplaceId);
        setIsWorkplaceOpen(false);
    };

    const handleStatusSelect = (statusValue: string) => {
        onStatusChange(statusValue);
        setIsStatusOpen(false);
    };

    return (
        <FilterContainer>
            <FilterRow>
                <TotalCountText>
                    총 <TotalCount>{totalCount}</TotalCount>
                    건
                </TotalCountText>
                <FilterGroup>
                    <DropdownContainer ref={workplaceRef}>
                        <FilterButton
                            onClick={() =>
                                setIsWorkplaceOpen(
                                    !isWorkplaceOpen
                                )
                            }
                        >
                            <FilterText>
                                {getSelectedWorkplaceLabel()}
                            </FilterText>
                            <FilterIcon
                                $isOpen={isWorkplaceOpen}
                            >
                                <img
                                    src={dropdownIcon}
                                    alt='드롭다운'
                                />
                            </FilterIcon>
                        </FilterButton>
                        {isWorkplaceOpen && (
                            <DropdownMenu>
                                {workplaceList.map(
                                    (workplace: Workplace) => (
                                        <DropdownItem
                                            key={
                                                workplace.id
                                            }
                                            $isSelected={
                                                workplace.id ===
                                                selectedWorkplace
                                            }
                                            onClick={() =>
                                                handleWorkplaceSelect(
                                                    workplace.id
                                                )
                                            }
                                        >
                                            {
                                                workplace.businessName
                                            }
                                        </DropdownItem>
                                    )
                                )}
                            </DropdownMenu>
                        )}
                    </DropdownContainer>

                    <DropdownContainer ref={statusRef}>
                        <FilterButton
                            onClick={() =>
                                setIsStatusOpen(
                                    !isStatusOpen
                                )
                            }
                        >
                            <FilterText>
                                {getSelectedStatusLabel()}
                            </FilterText>
                            <FilterIcon
                                $isOpen={isStatusOpen}
                            >
                                <img
                                    src={dropdownIcon}
                                    alt='드롭다운'
                                />
                            </FilterIcon>
                        </FilterButton>
                        {isStatusOpen && (
                            <DropdownMenu>
                                {statusOptions.map(
                                    (option) => (
                                        <DropdownItem
                                            key={
                                                option.value
                                            }
                                            $isSelected={
                                                option.value ===
                                                selectedStatus
                                            }
                                            onClick={() =>
                                                handleStatusSelect(
                                                    option.value
                                                )
                                            }
                                        >
                                            {option.label}
                                        </DropdownItem>
                                    )
                                )}
                            </DropdownMenu>
                        )}
                    </DropdownContainer>
                </FilterGroup>
            </FilterRow>
        </FilterContainer>
    );
};

export default StatusFilter;

const FilterContainer = styled.div`
    margin-bottom: 16px;
    background: #ffffff;
    border-radius: 16px;
    padding: 16px 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;

    @media (max-width: 480px) {
        padding: 12px 16px;
    }
`;

const FilterRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;

    @media (max-width: 768px) {
        flex-wrap: wrap;
        gap: 12px;
    }
`;

const TotalCountText = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    white-space: nowrap;

    @media (max-width: 480px) {
        font-size: 13px;
    }
`;

const TotalCount = styled.span`
    font-weight: 600;
    color: #333333;
`;

const FilterGroup = styled.div`
    display: flex;
    gap: 8px;
    flex: 1;
    justify-content: flex-end;

    @media (max-width: 768px) {
        width: 100%;
        flex: none;
    }

    @media (max-width: 480px) {
        gap: 6px;
    }
`;

const DropdownContainer = styled.div`
    position: relative;
    min-width: 140px;

    @media (max-width: 768px) {
        flex: 1;
        min-width: 0;
    }
`;

const FilterButton = styled.button`
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;

    &:hover {
        border-color: #2de283;
        background: #f8fffe;
    }

    &:active {
        transform: scale(0.98);
        background: #f0f8f6;
    }

    &:focus {
        outline: none;
        border-color: #2de283;
        box-shadow: 0 0 0 2px rgba(45, 226, 131, 0.1);
    }

    @media (max-width: 768px) {
        height: 38px;
        padding: 0 10px;
        border-radius: 6px;
    }

    @media (max-width: 480px) {
        height: 36px;
        padding: 0 8px;
        border-radius: 6px;
    }
`;

const FilterText = styled.span`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #333333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    text-align: left;

    @media (max-width: 768px) {
        font-size: 13px;
    }

    @media (max-width: 480px) {
        font-size: 12px;
    }
`;

interface FilterIconProps {
    $isOpen?: boolean;
}

interface DropdownItemProps {
    $isSelected?: boolean;
}

const FilterIcon = styled.span<FilterIconProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-left: 8px;
    transform: ${(props) =>
        props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
    transition: transform 0.2s ease;

    img {
        width: 16px;
        height: 16px;
    }

    @media (max-width: 768px) {
        margin-left: 6px;

        img {
            width: 14px;
            height: 14px;
        }
    }

    @media (max-width: 480px) {
        margin-left: 4px;

        img {
            width: 12px;
            height: 12px;
        }
    }
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    max-height: 240px;
    overflow-y: auto;
    animation: slideDown 0.2s ease;

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 768px) {
        border-radius: 6px;
    }

    @media (max-width: 480px) {
        border-radius: 6px;
        max-height: 200px;
    }
`;

const DropdownItem = styled.div<DropdownItemProps>`
    padding: 12px 16px;
    font-family: 'Pretendard';
    font-weight: ${(props) =>
        props.$isSelected ? '600' : '500'};
    font-size: 14px;
    color: ${(props) =>
        props.$isSelected ? '#2de283' : '#333333'};
    background: ${(props) =>
        props.$isSelected ? '#f0f8f6' : 'transparent'};
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: #f8fffe;
        color: #2de283;
    }

    &:active {
        background: #f0f8f6;
    }

    @media (max-width: 768px) {
        padding: 10px 14px;
        font-size: 13px;
    }

    @media (max-width: 480px) {
        padding: 8px 12px;
        font-size: 12px;
    }
`;
