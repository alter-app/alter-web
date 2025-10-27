import styled from 'styled-components';

const NotificationItem = ({ title, body, timeAgo }) => {
    return (
        <ItemContainer>
            <IconWrapper>
                <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                >
                    <path
                        d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9'
                        stroke='#2de283'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                    <path
                        d='M13.73 21a2 2 0 0 1-3.46 0'
                        stroke='#2de283'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </svg>
            </IconWrapper>
            <ContentSection>
                <NotificationTitle>
                    {title}
                </NotificationTitle>
                <NotificationBody>{body}</NotificationBody>
                <TimeText>{timeAgo}</TimeText>
            </ContentSection>
        </ItemContainer>
    );
};

export default NotificationItem;

const ItemContainer = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    background: #ffffff;
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    transition: all 0.2s ease;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        border-color: #e0e0e0;
    }
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    flex-shrink: 0;
`;

const ContentSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
`;

const NotificationTitle = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    color: #333333;
`;

const NotificationBody = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    line-height: 1.5;
`;

const TimeText = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 13px;
    color: #999999;
`;
