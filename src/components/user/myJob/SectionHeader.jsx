import styled from 'styled-components';

const SectionHeader = ({ icon, title }) => {
    return (
        <HeaderContainer>
            <IconWrapper>{icon}</IconWrapper>
            <Title>{title}</Title>
        </HeaderContainer>
    );
};

export default SectionHeader;

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Title = styled.h3`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    color: #333333;
    margin: 0;
`;


