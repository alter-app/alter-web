import styled from 'styled-components';

const CertificateInputForm = ({ value, onChange }) => {
    const handleDateChange = (e) => {
        onChange(e);
    };


    return (
    <Container>
        <AddRow>
            <CertificateLabel>이름</CertificateLabel>
            <CertificateInput
                name='certificateName'
                value={value.certificateName || ''}
                onChange={onChange}
            />
        </AddRow>
        <AddRow>
            <CertificateLabel>
                일련번호
            </CertificateLabel>
            <CertificateInput
                name='certificateId'
                value={value.certificateId || ''}
                onChange={onChange}
            />
        </AddRow>
        <AddRow>
            <CertificateLabel>
                발행 기관
            </CertificateLabel>
            <CertificateInput
                name='publisherName'
                value={value.publisherName || ''}
                onChange={onChange}
            />
        </AddRow>
        <AddRow>
            <CertificateLabel>취득일</CertificateLabel>
            <DateInputWrapper>
                <DateInput
                    type="date"
                    name="issuedAt"
                    value={value.issuedAt || ''}
                    onChange={handleDateChange}
                />
            </DateInputWrapper>
        </AddRow>
        <AddRow>
            <CertificateLabel>만료일 (선택)</CertificateLabel>
            <DateInputWrapper>
                <DateInput
                    type="date"
                    name="expiresAt"
                    value={value.expiresAt || ''}
                    onChange={handleDateChange}
                />
            </DateInputWrapper>
        </AddRow>
    </Container>
    );
};

export default CertificateInputForm;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const CertificateInput = styled.input`
    width: 100%;
    height: 48px;
    padding: 13px 16px;
    box-sizing: border-box;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;
    outline: none;
    border: 1px solid transparent;
    border-radius: 8px;
    border-color: #f6f6f6;
    background-color: #f6f6f6;

    &::placeholder {
        color: #cccccc;
    }

    &:focus {
        outline: none;
        border: 1px solid #2de283;
    }
`;

const CertificateLabel = styled.div`
    width: 140px;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    line-height: 18px;
    color: #111111;
    display: flex;
    align-items: center;
`;

const AddRow = styled.div`
    display: flex;
    gap: 20px;
    justify-content: space-between;
`;

const DateInputWrapper = styled.div`
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
`;

const DateInput = styled.input`
    width: 100%;
    height: 48px;
    padding: 13px 16px;
    box-sizing: border-box;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;
    outline: none;
    border: 1px solid #f6f6f6;
    background-color: #f6f6f6;
    color: #111111;
    cursor: pointer;

    &:focus {
        outline: none;
        border: 1px solid #2de283;
    }

    &::-webkit-calendar-picker-indicator {
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s ease;
    }

    &::-webkit-calendar-picker-indicator:hover {
        opacity: 1;
    }
`;

