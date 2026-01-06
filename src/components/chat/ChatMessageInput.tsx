import { useState } from 'react';
import styled from 'styled-components';

const ChatMessageInput = ({ onSend, disabled }) => {
    const [value, setValue] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!value.trim()) return;
        onSend(value.trim());
        setValue('');
    };

    return (
        <InputContainer onSubmit={handleSubmit}>
            <MessageInput
                type='text'
                value={value}
                onChange={(event) =>
                    setValue(event.target.value)
                }
                placeholder='메시지를 입력하세요'
                disabled={disabled}
            />
            <SendButton type='submit' disabled={disabled}>
                전송
            </SendButton>
        </InputContainer>
    );
};

export default ChatMessageInput;

const InputContainer = styled.form`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    border-top: 1px solid #e9ecef;
    background: #ffffff;
    flex-shrink: 0;
    box-sizing: content-box;
`;

const MessageInput = styled.input`
    flex: 1;
    border: 1px solid #d9d9d9;
    border-radius: 20px;
    padding: 8px 16px;
    font-family: 'Pretendard';
    font-size: 15px;
    line-height: 20px;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    box-sizing: content-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:focus {
        border-color: #399982;
        box-shadow: 0 0 0 3px rgba(57, 153, 130, 0.12);
    }

    &::placeholder {
        color: #999999;
    }
`;

const SendButton = styled.button`
    height: 36px;
    padding: 0 20px;
    border: none;
    border-radius: 20px;
    background: #399982;
    color: #ffffff;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: background 0.2s ease;
    white-space: nowrap;
    flex-shrink: 0;
    box-sizing: content-box;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    &:not(:disabled):hover {
        background: #2f7f6b;
    }
`;
