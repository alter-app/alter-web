import styled from 'styled-components';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import userIcon from '../../assets/icons/userIcon.png';

dayjs.extend(relativeTime);
dayjs.locale('ko');

const ChatRoomList = ({
    rooms,
    onSelect,
    isLoading,
    onLoadMore,
    hasMore,
}) => {
    const handleScroll = (event) => {
        if (!hasMore || isLoading) {
            return;
        }
        const { scrollTop, scrollHeight, clientHeight } =
            event.currentTarget;

        const isScrollable =
            scrollHeight - clientHeight > 8;
        if (!isScrollable) {
            return;
        }

        if (
            scrollTop + clientHeight >=
            scrollHeight - 100
        ) {
            onLoadMore?.();
        }
    };

    const formatTime = (date) => {
        if (!date) return '';
        const now = dayjs();
        const messageDate = dayjs(date);
        const diffInDays = now.diff(messageDate, 'day');

        if (diffInDays === 0) {
            return messageDate.format('HH:mm');
        } else if (diffInDays === 1) {
            return '어제';
        } else if (diffInDays < 7) {
            return messageDate.format('ddd');
        } else {
            return messageDate.format('YYYY.MM.DD');
        }
    };

    return (
        <RoomListContainer onScroll={handleScroll}>
            {rooms.map((room) => (
                <RoomItem
                    key={room.id}
                    onClick={() => onSelect(room)}
                >
                    <ProfileImageWrapper>
                        <ProfileImage
                            src={userIcon}
                            alt={room.opponentName}
                        />
                    </ProfileImageWrapper>
                    <RoomContent>
                        <RoomHeader>
                            <RoomHeaderLeft>
                                <RoomTitle>
                                    {room.opponentName ||
                                        '알 수 없음'}
                                </RoomTitle>
                                {room.unreadCount > 0 && (
                                    <UnreadCount>
                                        {room.unreadCount}
                                    </UnreadCount>
                                )}
                            </RoomHeaderLeft>
                            <RoomTimestamp>
                                {formatTime(
                                    room.updatedAt ||
                                        room.createdAt
                                )}
                            </RoomTimestamp>
                        </RoomHeader>
                        <RoomPreview>
                            {room.latestMessageContent ||
                                '대화를 시작해보세요.'}
                        </RoomPreview>
                    </RoomContent>
                </RoomItem>
            ))}
            {isLoading && (
                <LoadingIndicator>
                    불러오는 중...
                </LoadingIndicator>
            )}
            {!isLoading && rooms.length === 0 && (
                <EmptyState>
                    아직 대화 중인 채팅방이 없어요.
                </EmptyState>
            )}
        </RoomListContainer>
    );
};

export default ChatRoomList;

const RoomListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 0;
    overflow-y: auto;
    height: calc(100vh - 140px);
    background: #ffffff;
`;

const RoomItem = styled.button`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
    padding: 16px;
    border: none;
    border-bottom: 1px solid #e8e8e8;
    background: #ffffff;
    cursor: pointer;
    transition: background 0.2s ease;
    gap: 12px;

    &:hover {
        background: #f8f8f8;
    }

    &:active {
        background: #f0f0f0;
    }
`;

const ProfileImageWrapper = styled.div`
    flex-shrink: 0;
    width: 56px;
    height: 56px;
`;

const ProfileImage = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
`;

const RoomContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
`;

const RoomHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 8px;
`;

const RoomHeaderLeft = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    flex: 1;
    min-width: 0;
`;

const RoomTitle = styled.span`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 15px;
    color: #111111;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
    text-align: left;
`;

const UnreadCount = styled.span`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #666666;
    flex-shrink: 0;
`;

const RoomTimestamp = styled.span`
    font-family: 'Pretendard';
    font-size: 13px;
    color: #999999;
    flex-shrink: 0;
    white-space: nowrap;
`;

const RoomPreview = styled.span`
    font-family: 'Pretendard';
    font-size: 14px;
    color: #333333;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    text-align: left;
`;

const LoadingIndicator = styled.div`
    font-family: 'Pretendard';
    font-size: 14px;
    color: #666666;
    text-align: center;
    padding: 12px 0;
`;

const EmptyState = styled.div`
    font-family: 'Pretendard';
    font-size: 14px;
    color: #999999;
    text-align: center;
    padding: 40px 0;
`;
