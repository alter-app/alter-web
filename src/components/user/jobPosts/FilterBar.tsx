import styled from 'styled-components';
import dropdownIcon from '../../../assets/icons/dropdown.svg';

const FilterBar = ({
    sortValue,
    onSortChange,
    salaryValue,
    onSalaryChange,
    regionValue,
    onRegionChange,
}) => {
    return (
        <FilterContainer>
            <FilterButton onClick={onSortChange}>
                <FilterText>
                    {sortValue || '정렬'}
                </FilterText>
                <FilterIcon>
                    <img
                        src={dropdownIcon}
                        alt='드롭다운'
                    />
                </FilterIcon>
            </FilterButton>

            <FilterButton onClick={onSalaryChange}>
                <FilterText>
                    {salaryValue || '급여'}
                </FilterText>
                <FilterIcon>
                    <img
                        src={dropdownIcon}
                        alt='드롭다운'
                    />
                </FilterIcon>
            </FilterButton>

            <FilterButton onClick={onRegionChange}>
                <FilterText>
                    {regionValue || '지역'}
                </FilterText>
                <FilterIcon>
                    <img
                        src={dropdownIcon}
                        alt='드롭다운'
                    />
                </FilterIcon>
            </FilterButton>
        </FilterContainer>
    );
};

export default FilterBar;

const FilterContainer = styled.div`
    display: flex;
    gap: 8px;
    width: calc(100% - 40px);
    margin: 16px 20px 0 20px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
        gap: 6px;
        width: calc(100% - 32px);
        margin: 14px 16px 0 16px;
    }

    @media (max-width: 480px) {
        gap: 4px;
        width: calc(100% - 24px);
        margin: 12px 12px 0 12px;
    }

    @media (max-width: 360px) {
        gap: 3px;
        width: calc(100% - 20px);
        margin: 10px 10px 0 10px;
    }

    @media (max-width: 320px) {
        gap: 2px;
        width: calc(100% - 16px);
        margin: 8px 8px 0 8px;
    }
`;

const FilterButton = styled.button`
    flex: 1;
    min-width: 0;
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
        border-color: #399982;
        background: #f8fffe;
    }

    &:active {
        transform: scale(0.98);
        background: #f0f8f6;
    }

    &:focus {
        outline: none;
        border-color: #399982;
        box-shadow: 0 0 0 2px rgba(57, 153, 130, 0.1);
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

    @media (max-width: 360px) {
        height: 34px;
        padding: 0 6px;
        border-radius: 4px;
    }

    @media (max-width: 320px) {
        height: 32px;
        padding: 0 4px;
        border-radius: 4px;
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

    @media (max-width: 360px) {
        font-size: 11px;
    }

    @media (max-width: 320px) {
        font-size: 10px;
    }
`;

const FilterIcon = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-left: 4px;

    img {
        width: 16px;
        height: 16px;
        transition: all 0.2s ease;
    }

    @media (max-width: 768px) {
        margin-left: 3px;

        img {
            width: 14px;
            height: 14px;
        }
    }

    @media (max-width: 480px) {
        margin-left: 2px;

        img {
            width: 12px;
            height: 12px;
        }
    }

    @media (max-width: 360px) {
        margin-left: 2px;

        img {
            width: 10px;
            height: 10px;
        }
    }

    @media (max-width: 320px) {
        margin-left: 1px;

        img {
            width: 8px;
            height: 8px;
        }
    }
`;
