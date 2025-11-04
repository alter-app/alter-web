import styled, { css } from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import ArrowDownIcon from '../assets/icons/dropdown.svg';

const Dropdown = ({ options = [], onChange, width }) => {
    const list = options;
    const selectRef = useRef(null);
    const [currentValue, setCurrentValue] = useState();
    const [showOptions, setShowOptions] = useState(false);

    // options가 바뀔 때마다 currentValue도 갱신
    useEffect(() => {
        if (list.length > 0 && !currentValue) {
            setCurrentValue(list[0]); // 처음 한 번만 초기 선택
            if (onChange) onChange(list[0].id);
        }
    }, [list]);

    // 외부 클릭 감지되면 드롭다운 닫음
    useEffect(() => {
        const handleClick = (e) => {
            if (
                selectRef.current &&
                !selectRef.current.contains(e.target)
            ) {
                setShowOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () =>
            document.removeEventListener(
                'mousedown',
                handleClick
            );
    }, []);

    return (
        <SelectBox
            onClick={() => setShowOptions((prev) => !prev)}
            ref={selectRef}
            width={width}
        >
            <Label width={width}>
                {currentValue?.name}
            </Label>
            <ArrowWrapper>
                <DropdownIcon
                    open={showOptions}
                    src={ArrowDownIcon}
                    alt='dropdown'
                />
            </ArrowWrapper>
            <SelectOptions $show={showOptions}>
                {list.map((item) => (
                    <Option
                        key={item.id}
                        value={item.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            setCurrentValue(item);
                            setShowOptions(false);
                            if (onChange) onChange(item.id); // 선택된 id를 상위로 전달
                        }}
                    >
                        {item.name}
                    </Option>
                ))}
            </SelectOptions>
        </SelectBox>
    );
};
export default Dropdown;

const SelectBox = styled.div`
    position: relative;
    width: ${({ width }) =>
        width ? `${width}px` : '250px'};
    height: 48px;
    padding: 14px;
    box-sizing: border-box;
    border-radius: 8px;
    background-color: #ffffff;
    align-self: center;
    border: 1px solid #cccccc;
    cursor: pointer;
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
        width: ${({ width }) => (width ? `100%` : '100%')};
        height: 48px;
        padding: 12px 14px;
    }
`;

const ArrowWrapper = styled.div`
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
`;

const Label = styled.div`
    font-size: 14px;
    display: inline-block;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;
    width: ${({ width }) =>
        width ? `${width - 50}px` : '200px'};
    box-sizing: border-box; /* 패딩/보더 포함한 크기 계산 */
    overflow: hidden; /* 넘치는 내용 숨김 */
    white-space: nowrap; /* 줄바꿈 없이 한 줄로 표시 */
    text-overflow: ellipsis; /* 넘치면 ...으로 표시 */

    @media (max-width: 768px) {
        width: calc(100% - 50px);
        font-size: 15px;
    }
`;

const SelectOptions = styled.ul`
    position: absolute;
    top: 31px;
    left: 0;
    width: 100%;
    overflow-y: auto;
    border: ${({ $show }) =>
        $show ? '1px solid #cccccc' : 'none'};
    border-radius: 5px;
    max-height: ${({ $show }) => ($show ? '200px' : '0')};
    background-color: #fefefe;
    z-index: 10;
    pointer-events: ${({ $show }) =>
        $show ? 'auto' : 'none'};
    list-style: none;
    padding: 0;

    @media (max-width: 768px) {
        top: 100%;
        max-height: ${({ $show }) =>
            $show ? '180px' : '0'};
    }
`;

const Option = styled.li`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    padding: 10px;
    cursor: pointer;
    touch-action: manipulation;

    &:hover {
        color: white;
        border-radius: 5px;
        background: #2de283;
    }

    @media (max-width: 768px) {
        padding: 12px 10px;
        font-size: 15px;
        line-height: 22px;
    }
`;

const DropdownIcon = styled.img`
    width: 20px;
    height: 20px;
    display: flex;
    cursor: pointer;
    ${({ open }) =>
        open &&
        css`
            transform: rotate(180deg);
        `}
`;
