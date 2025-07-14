import styled from 'styled-components';

const CertificateInputForm = ({ value, onChange }) => (
    <Container>
        <AddRow>
            <CertificateLabel>자격증 이름</CertificateLabel>
            <CertificateInput
                name='certificateName'
                value={value.certificateName || ''}
                onChange={onChange}
                placeholder='정보처리기사'
            />
        </AddRow>
        <AddRow>
            <CertificateLabel>
                자격증 일련번호
            </CertificateLabel>
            <CertificateInput
                name='certificateId'
                value={value.certificateId || ''}
                onChange={onChange}
                placeholder='1234567890'
            />
        </AddRow>
        <AddRow>
            <CertificateLabel>
                발행 기관 이름
            </CertificateLabel>
            <CertificateInput
                name='publisherName'
                value={value.publisherName || ''}
                onChange={onChange}
                placeholder='한국산업인력공단'
            />
        </AddRow>
        <AddRow>
            <CertificateLabel>취득일</CertificateLabel>
            <CertificateInput
                name='issuedAt'
                value={value.issuedAt || ''}
                onChange={onChange}
                placeholder='2023-05-20'
            />
        </AddRow>
        <AddRow>
            <CertificateLabel>만료일</CertificateLabel>
            <CertificateInput
                name='expiresAt'
                value={value.expiresAt || ''}
                onChange={onChange}
                placeholder='2028-05-20 (없으면 비워두세요)'
            />
        </AddRow>
    </Container>
);

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
        color: #999999;
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
