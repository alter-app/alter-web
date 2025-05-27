import { useState } from 'react';
import styled, { css } from 'styled-components';

const days = [
    { label: '월', value: 'MONDAY' },
    { label: '화', value: 'TUESDAY' },
    { label: '수', value: 'WEDNESDAY' },
    { label: '목', value: 'THURSDAY' },
    { label: '금', value: 'FRIDAY' },
    { label: '토', value: 'SATURDAY' },
    { label: '일', value: 'SUNDAY' },
];

export default function WorkingDaysCategory({ onChange }) {
    // 이제 selected는 value(영문 요일) 배열!
    const [selected, setSelected] = useState([]);

    const handleToggle = (value) => {
        let next;
        if (selected.includes(value)) {
            next = selected.filter((v) => v !== value);
        } else {
            next = [...selected, value];
        }
        setSelected(next);
        if (onChange) onChange(next);
    };

    return (
        <Container>
            {days.map((day) => (
                <DayBox
                    key={day.value}
                    $isSelected={selected.includes(
                        day.value
                    )}
                    onClick={() => handleToggle(day.value)}
                >
                    {day.label}
                </DayBox>
            ))}
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    gap: 12px;
`;

const DayBox = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    border: none;
    background: #fff;
    cursor: pointer;

    ${({ $isSelected }) =>
        $isSelected &&
        css`
            color: #ffffff;
            background: #2de283;
            border: none;
        `}
`;
