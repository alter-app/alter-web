import styled from 'styled-components';

const DetailInputField = ({ name, value, onChange }) => {
    return (
        <Container>
            <Title>상세내용</Title>
            <DetailTextArea
                id='detail'
                name={name}
                value={value}
                onChange={onChange}
                placeholder='예시: 주요 업무, 근무 방식, 팀 분위기, 지원 자격 및 우대사항 등 지원자가 궁금해할 내용을 자유롭게 입력해 주세요.
(예: 바리스타 업무 및 음료 제조, 협업이 잘 되는 팀, 시간 약속을 잘 지키는 분 환영)
'
            />
        </Container>
    );
};

export default DetailInputField;

const Container = styled.div`
    width: 100%;
    max-width: 820px;
    background-color: #ffffff;
    border-radius: 4px;
    padding: 20px;
    box-sizing: border-box;

    @media (max-width: 768px) {
        padding: 20px 16px;
    }
`;

const Title = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #111111;

    @media (max-width: 768px) {
        font-size: 15px;
        line-height: 22px;
    }
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

    &::placeholder {
        color: #999999;
    }

    @media (max-width: 768px) {
        height: 250px;
        margin-top: 16px;
        padding: 12px;
        font-size: 15px;
        line-height: 22px;
    }
`;
