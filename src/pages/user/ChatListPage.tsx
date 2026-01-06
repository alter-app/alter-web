import { useEffect, useState } from 'react';
import styled from 'styled-components';
import PageHeader from '../../components/shared/PageHeader';
import ChatRoomList from '../../components/chat/ChatRoomList';
import BottomNavigation from '../../layouts/BottomNavigation';
import Loader from '../../components/Loader';
import { getChatRooms } from '../../services/chatService';
import { useNavigate } from 'react-router-dom';
import { chatSocketManager } from '../../services/chatSocket';

const ChatListPage = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [cursor, setCursor] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const handleLoadMore = async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        try {
            const response = await getChatRooms({
                cursor,
                scope: 'APP',
            });
            const fetchedRooms = response.data || [];
            setRooms((prev) => [...prev, ...fetchedRooms]);
            const nextCursor = response.page?.cursor || '';
            setCursor(nextCursor);
            setHasMore(Boolean(nextCursor));
        } catch (error) {
            console.error('채팅방 목록 조회 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const loadInitialRooms = async () => {
            setIsLoading(true);
            try {
                const response = await getChatRooms({
                    cursor: '',
                    scope: 'APP',
                });
                if (!isMounted) return;
                const fetchedRooms = response.data || [];
                setRooms(fetchedRooms);
                const nextCursor =
                    response.page?.cursor || '';
                setCursor(nextCursor);
                setHasMore(Boolean(nextCursor));
            } catch (error) {
                if (isMounted) {
                    console.error(
                        '채팅방 목록 조회 실패:',
                        error
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadInitialRooms();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        chatSocketManager.ensureConnected();
    }, []);

    const handleSelectRoom = (room) => {
        navigate(`/chat/rooms/${room.id}`, {
            state: {
                opponentName: room.opponentName,
                opponentId: room.opponentId,
            },
        });
    };

    return (
        <>
            <PageHeader
                title='채팅'
                showBackButton={false}
            />
            <ChatListWrapper>
                {isLoading && rooms.length === 0 ? (
                    <LoaderWrapper>
                        <Loader />
                    </LoaderWrapper>
                ) : (
                    <ChatRoomList
                        rooms={rooms}
                        onSelect={handleSelectRoom}
                        isLoading={isLoading}
                        onLoadMore={handleLoadMore}
                        hasMore={hasMore}
                    />
                )}
            </ChatListWrapper>
            <BottomNavigation />
        </>
    );
};

export default ChatListPage;

const ChatListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 60px;
    padding-bottom: 80px;
    min-height: 100vh;
    background: #ffffff;
`;

const LoaderWrapper = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 140px);
`;
