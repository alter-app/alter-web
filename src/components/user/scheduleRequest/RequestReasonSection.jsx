import { useState } from 'react';
import styled from 'styled-components';

const RequestReasonSection = ({
    reason,
    onReasonChange,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <Section>
            <SectionHeader>
                <SectionIcon>💬</SectionIcon>
                <SectionTitle>요청 사유</SectionTitle>
            </SectionHeader>
            <TextArea
                value={reason}
                onChange={(e) =>
                    onReasonChange(e.target.value)
                }
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder='요청 사유를 입력해주세요'
                $isFocused={isFocused}
            />
        </Section>
    );
};

export default RequestReasonSection;

const Section = styled.div`
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e9ecef;
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
`;

const SectionIcon = styled.span`
    font-size: 20px;
`;

const SectionTitle = styled.h3`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 18px;
    color: #333333;
    margin: 0;
`;

const TextArea = styled.textarea`
    width: 100%;
    min-height: 120px;
    padding: 16px;
    border: 2px solid
        ${(props) =>
            props.$isFocused ? '#2de283' : '#e9ecef'};
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    background: #ffffff;
    resize: vertical;
    transition: all 0.2s ease;
    outline: none;

    &::placeholder {
        color: #999999;
    }

    &:focus {
        border-color: #2de283;
        box-shadow: 0 0 0 3px rgba(45, 226, 131, 0.1);
    }
`;
