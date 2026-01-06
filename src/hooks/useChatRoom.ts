import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { chatSocketManager } from '../services/chatSocket';
import { getChatMessages } from '../services/chatService';

interface ChatMessage {
    id?: string;
    senderId?: string;
    content: string;
    isMine?: boolean;
    createdAt?: string;
}

interface UseChatRoomOptions {
    chatRoomId: string | null | undefined;
    scope?: 'APP' | 'MANAGER';
    opponentId?: string | number | null;
}

const useChatRoom = ({
    chatRoomId,
    scope = 'APP',
    opponentId,
}: UseChatRoomOptions) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [cursor, setCursor] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const isMountedRef = useRef(true);
    const cursorRef = useRef('');
    const hasMoreRef = useRef(true);
    const isLoadingRef = useRef(false);
    const opponentIdRef = useRef<string | number | null | undefined>(opponentId);

    const loadMessages = useCallback(
        async ({ reset = false }: { reset?: boolean } = {}) => {
            if (!chatRoomId) return;
            if (isLoadingRef.current) return;
            if (!reset && !hasMoreRef.current) return;

            isLoadingRef.current = true;
            setIsLoading(true);
            try {
                const response = await getChatMessages({
                    chatRoomId,
                    cursor: reset
                        ? undefined
                        : cursorRef.current,
                    scope,
                });

                const fetchedMessages = (response.data || []) as ChatMessage[];
                const nextCursor =
                    response.page?.cursor || '';
                cursorRef.current = nextCursor;
                hasMoreRef.current = Boolean(nextCursor);
                setCursor(nextCursor);
                setHasMore(hasMoreRef.current);
                setMessages((prev) =>
                    reset
                        ? fetchedMessages
                        : [...fetchedMessages, ...prev]
                );
            } catch (error) {
                console.error(
                    '채팅 메시지 조회 실패:',
                    error
                );
            } finally {
                if (isMountedRef.current) {
                    setIsLoading(false);
                }
                isLoadingRef.current = false;
            }
        },
        [chatRoomId, scope]
    );

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        cursorRef.current = '';
        hasMoreRef.current = true;
        setMessages([]);
        setCursor('');
        setHasMore(true);
        loadMessages({ reset: true });
    }, [chatRoomId, loadMessages]);

    useEffect(() => {
        opponentIdRef.current = opponentId;
    }, [opponentId]);

    useEffect(() => {
        if (!chatRoomId) return undefined;
        const unsubscribe = chatSocketManager.subscribe(
            chatRoomId,
            (message: ChatMessage) => {
                // WebSocket 메시지에 isMine이 없으면 opponentId와 비교해서 설정
                if (
                    message.isMine === undefined &&
                    opponentIdRef.current
                ) {
                    message.isMine =
                        message.senderId !==
                        opponentIdRef.current;
                }
                setMessages((prev) => [...prev, message]);
            }
        );

        return () => {
            unsubscribe();
        };
    }, [chatRoomId]);

    const handleSendMessage = useCallback(
        async (content: string) => {
            if (!content || !content.trim()) return;
            setIsSending(true);
            try {
                chatSocketManager.sendMessage({
                    chatRoomId: chatRoomId!,
                    content,
                    scope,
                });
            } catch (error) {
                console.error('메시지 전송 실패:', error);
            } finally {
                if (isMountedRef.current) {
                    setIsSending(false);
                }
            }
        },
        [chatRoomId, scope]
    );

    return {
        messages,
        isLoading,
        hasMore,
        loadMoreMessages: () =>
            loadMessages({ reset: false }),
        refreshMessages: () =>
            loadMessages({ reset: true }),
        sendMessage: handleSendMessage,
        isSending,
    };
};

export default useChatRoom;

