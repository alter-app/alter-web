import styled from 'styled-components';

const ViewAllButton = ({
    onClick,
    children = '전체 보기',
}) => {
    return <Button onClick={onClick}>{children}</Button>;
};

export default ViewAllButton;

const Button = styled.button`
    width: 100%;
    padding: 12px 16px;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #666666;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 16px;

    &:hover {
        background: #e9ecef;
        color: #333333;
    }

    &:active {
        transform: scale(0.98);
    }
`;


