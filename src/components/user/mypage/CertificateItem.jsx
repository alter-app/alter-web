import styled, { css } from 'styled-components';
import dropdown from '../../../assets/icons/dropdown.svg';

const CertificateItem = ({
    id,
    certificateName,
    issuedAt,
    publisherName,
    isOpen,
    onToggle,
}) => {
    return (
        <Container $isOpen={isOpen}>
            <Column>
                <CertificateName>
                    {certificateName}
                </CertificateName>
                <PublisherName>
                    {publisherName}
                </PublisherName>
            </Column>
            <Column>
                <IssuedAt>{issuedAt}</IssuedAt>
            </Column>
            <Dropdown
                onClick={onToggle}
                src={dropdown}
                open={isOpen}
                alt='드롭다운'
            />
        </Container>
    );
};
export default CertificateItem;

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f6f6f6;
    padding: 30px 0px;
    box-sizing: border-box;
    ${({ $isOpen }) =>
        $isOpen &&
        css`
            border-bottom: none;
        `}
`;

const CertificateName = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
`;

const PublisherName = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
`;

const IssuedAt = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
`;

const Dropdown = styled.img`
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
