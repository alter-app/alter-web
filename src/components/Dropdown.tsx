import styled, { css } from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import ArrowDownIcon from '../assets/icons/dropdown.svg';

interface DropdownOption {
    id: string | number;
    name: string;
    [key: string]: unknown;
}

interface DropdownProps {
    options?: DropdownOption[];
    onChange?: (id: string | number) => void;
    width?: number;
    value?: string | number;
}

const Dropdown = ({
    options = [],
    onChange,
    width,
    value,
}: DropdownProps) => {
    const list = options;
    const selectRef = useRef<HTMLDivElement>(null);
    const [currentValue, setCurrentValue] = useState<DropdownOption | null>(() => {
        // value prop이 있으면 해당 값을 찾아서 설정
        if (value && list.length > 0) {
            const found = list.find(
                (item) => item.id === value
            );
            return found || null;
        }
        return null;
    });
    const [showOptions, setShowOptions] = useState(false);

    // value prop이 변경되면 currentValue 업데이트
    useEffect(() => {
        if (value && list.length > 0) {
            const found = list.find(
                (item) => item.id === value
            );
            if (found) {
                setCurrentValue(found);
            }
        } else if (!value) {
            setCurrentValue(null);
        }
    }, [value, list]);

    // 외부 클릭 감지되면 드롭다운 닫음
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (
                selectRef.current &&
                e.target instanceof Node &&
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
                {currentValue?.name || '선택하세요'}
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
                        onClick={(e: React.MouseEvent<HTMLLIElement>) => {
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

interface SelectBoxProps {
    width?: number;
}

interface LabelProps {
    width?: number;
}

interface SelectOptionsProps {
    $show?: boolean;
}

interface DropdownIconProps {
    open?: boolean;
}

const SelectBox = styled.div<SelectBoxProps>`
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

const Label = styled.div<LabelProps>`
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

const SelectOptions = styled.ul<SelectOptionsProps>`
    position: absolute;
    top: calc(100% + 4px);
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
    margin: 0;

    @media (max-width: 768px) {
        top: calc(100% + 4px);
        max-height: ${({ $show }) =>
            $show ? '180px' : '0'};
    }
`;

const Option = styled.li`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    padding: 8px 10px;
    cursor: pointer;
    touch-action: manipulation;

    &:hover {
        color: white;
        border-radius: 5px;
        background: #2de283;
    }

    @media (max-width: 768px) {
        padding: 10px 10px;
        font-size: 15px;
        line-height: 22px;
    }
`;

const DropdownIcon = styled.img<DropdownIconProps>`
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
