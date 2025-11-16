import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.locale('ko');
dayjs.extend(customParseFormat);

const ChatMessageList = ({
    messages,
    onLoadMore,
    hasMore,
    isLoading,
}) => {
    const listRef = useRef(null);
    const prevMessagesLengthRef = useRef(0);
    const isScrolledToBottomRef = useRef(true);
    const shouldAutoScrollRef = useRef(true);

    const checkIfScrolledToBottom = (element) => {
        const threshold = 100; // 100px 이내면 맨 아래로 간주
        return (
            element.scrollHeight -
                element.scrollTop -
                element.clientHeight <
            threshold
        );
    };

    const handleScroll = (event) => {
        const element = event.currentTarget;
        isScrolledToBottomRef.current =
            checkIfScrolledToBottom(element);

        // 위로 스크롤해서 이전 메시지 로드
        if (
            element.scrollTop < 100 &&
            hasMore &&
            !isLoading
        ) {
            const previousScrollHeight =
                element.scrollHeight;
            onLoadMore?.();

            // 이전 메시지 로드 후 스크롤 위치 유지
            setTimeout(() => {
                const newScrollHeight =
                    element.scrollHeight;
                const scrollDiff =
                    newScrollHeight - previousScrollHeight;
                element.scrollTop += scrollDiff;
            }, 0);
        }
    };

    // 초기 로드 시 맨 아래로 스크롤
    useEffect(() => {
        const listElement = listRef.current;
        if (!listElement || messages.length === 0) return;

        // 첫 로드 시에만 맨 아래로 스크롤
        if (
            prevMessagesLengthRef.current === 0 &&
            messages.length > 0
        ) {
            requestAnimationFrame(() => {
                if (listElement) {
                    listElement.scrollTop =
                        listElement.scrollHeight;
                    isScrolledToBottomRef.current = true;
                }
            });
        }
    }, [messages.length]);

    useEffect(() => {
        const listElement = listRef.current;
        if (!listElement) return;

        const prevLength = prevMessagesLengthRef.current;
        const currentLength = messages.length;

        // 메시지가 추가된 경우
        if (currentLength > prevLength) {
            const prevFirstMessageId =
                prevLength > 0
                    ? messages[0]?.id ||
                      messages[0]?.createdAt
                    : null;
            const currentFirstMessageId =
                messages[0]?.id || messages[0]?.createdAt;

            // 첫 번째 메시지가 같으면 새 메시지가 뒤에 추가된 것
            const isNewMessage =
                prevFirstMessageId ===
                currentFirstMessageId;

            // 새 메시지가 추가되고 사용자가 맨 아래에 있을 때만 자동 스크롤
            if (
                isNewMessage &&
                isScrolledToBottomRef.current
            ) {
                // requestAnimationFrame을 사용하여 DOM 업데이트 후 스크롤
                requestAnimationFrame(() => {
                    if (listElement) {
                        listElement.scrollTop =
                            listElement.scrollHeight;
                    }
                });
            }
        }

        prevMessagesLengthRef.current = currentLength;
    }, [messages]);

    return (
        <MessageListContainer
            ref={listRef}
            onScroll={handleScroll}
        >
            {isLoading && hasMore && (
                <LoadMoreText>
                    이전 메시지 불러오는 중...
                </LoadMoreText>
            )}
            {messages.map((message) => (
                <MessageWrapper
                    key={message.id || message.createdAt}
                    $isMine={message.isMine}
                >
                    {message.isMine && (
                        <MessageTimestamp
                            $isMine={message.isMine}
                        >
                            {dayjs(message.createdAt)
                                .format('A h:mm')
                                .replace('AM', '오전')
                                .replace('PM', '오후')}
                        </MessageTimestamp>
                    )}
                    <MessageBubble $isMine={message.isMine}>
                        <MessageContent>
                            {message.content}
                        </MessageContent>
                    </MessageBubble>
                    {!message.isMine && (
                        <MessageTimestamp
                            $isMine={message.isMine}
                        >
                            {dayjs(message.createdAt)
                                .format('A h:mm')
                                .replace('AM', '오전')
                                .replace('PM', '오후')}
                        </MessageTimestamp>
                    )}
                </MessageWrapper>
            ))}
        </MessageListContainer>
    );
};

export default ChatMessageList;

const MessageListContainer = styled.div`
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #f7f8fa;
`;

const MessageWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    gap: 6px;
    align-self: ${(props) =>
        props.$isMine ? 'flex-end' : 'flex-start'};
    max-width: 80%;
`;

const MessageBubble = styled.div`
    padding: 12px 14px;
    border-radius: ${(props) =>
        props.$isMine
            ? '18px 18px 4px 18px'
            : '18px 18px 18px 4px'};
    background: ${(props) =>
        props.$isMine ? '#399982' : '#ffffff'};
    color: ${(props) =>
        props.$isMine ? '#ffffff' : '#333333'};
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    border: ${(props) =>
        props.$isMine ? 'none' : '1px solid #e0e0e0'};
`;

const MessageContent = styled.span`
    font-family: 'Pretendard';
    font-size: 15px;
    line-height: 1.4;
    word-wrap: break-word;
    white-space: pre-wrap;
`;

const MessageTimestamp = styled.span`
    font-family: 'Pretendard';
    font-size: 12px;
    color: #999999;
    white-space: nowrap;
    flex-shrink: 0;
    margin-bottom: 2px;
`;

const LoadMoreText = styled.div`
    text-align: center;
    font-size: 12px;
    color: #999999;
    margin-bottom: 8px;
`;
