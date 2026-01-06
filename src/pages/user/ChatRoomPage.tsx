import { useCallback, useEffect, useState } from 'react';
import {
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom';
import styled from 'styled-components';
import PageHeader from '../../components/shared/PageHeader';
import ChatMessageList from '../../components/chat/ChatMessageList';
import ChatMessageInput from '../../components/chat/ChatMessageInput';
import useChatRoom from '../../hooks/useChatRoom';
import { chatSocketManager } from '../../services/chatSocket';
import { getChatRoomDetail } from '../../services/chatService';

const ChatRoomPage = () => {
    const { chatRoomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [roomInfo, setRoomInfo] = useState(null);
    const {
        messages,
        isLoading,
        hasMore,
        loadMoreMessages,
        sendMessage,
        isSending,
    } = useChatRoom({
        chatRoomId,
        scope: 'APP',
        opponentId: roomInfo?.opponentId,
    });

    useEffect(() => {
        chatSocketManager.ensureConnected();
    }, []);

    const fetchRoomInfo = useCallback(async () => {
        try {
            const response = await getChatRoomDetail({
                chatRoomId,
                scope: 'APP',
            });
            setRoomInfo(response.data);
        } catch (error) {
            console.error(
                '채팅방 정보를 불러오지 못했습니다.',
                error
            );
            navigate(-1);
        }
    }, [chatRoomId, navigate]);

    useEffect(() => {
        if (location.state?.opponentName) {
            setRoomInfo({
                opponentName: location.state.opponentName,
                opponentId: location.state?.opponentId,
            });
        } else {
            fetchRoomInfo();
        }
    }, [location.state, fetchRoomInfo]);

    return (
        <ChatRoomLayout>
            <PageHeader
                title={roomInfo?.opponentName || '채팅'}
                showBackButton
                onBack={() => navigate(-1)}
            />
            <ChatRoomContent>
                <ChatMessageList
                    messages={messages}
                    onLoadMore={loadMoreMessages}
                    hasMore={hasMore}
                    isLoading={isLoading}
                />
                <ChatMessageInput
                    onSend={sendMessage}
                    disabled={isSending}
                />
            </ChatRoomContent>
        </ChatRoomLayout>
    );
};

export default ChatRoomPage;

const ChatRoomLayout = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #f7f8fa;
    box-sizing: content-box;

    * {
        box-sizing: content-box;
    }
`;

const ChatRoomContent = styled.div`
    padding-top: 60px;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 60px);
    overflow: hidden;
    position: relative;
    box-sizing: content-box;
`;
