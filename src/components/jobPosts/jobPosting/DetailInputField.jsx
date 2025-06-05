import styled from 'styled-components';
import { useState } from 'react';

const DetailInputField = () => {
    const [value, setValue] = useState('');
    console.log(value);

    return (
        <Container>
            <Title>상세내용</Title>
            <DetailTextArea
                id='detail'
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder=''
            />
        </Container>
    );
};

export default DetailInputField;

const Container = styled.div`
    width: 820px;
    background-color: #ffffff;
    border-radius: 4px;
    padding: 20px;
    box-sizing: border-box;
`;

const Title = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #111111;
`;

const DetailTextArea = styled.textarea`
    width: 100%;
    height: 300px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    resize: none;
    outline: none;
    margin-top: 20px;
    padding: 10px;
    box-sizing: border-box;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;
    &:focus {
        border: 1px solid #2de283;
    }
`;
