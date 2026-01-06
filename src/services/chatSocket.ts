import { Client, IMessage } from '@stomp/stompjs';
import useAuthStore from '../store/authStore';

const WS_URL =
    import.meta.env.VITE_WS_URL ||
    (import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace(
              /^http/,
              'ws'
          ) + '/ws-connect'
        : '');

interface ChatMessage {
    id?: string;
    senderId?: string;
    content: string;
    isMine?: boolean;
    createdAt?: string;
}

type Scope = 'APP' | 'MANAGER';

class ChatSocketManager {
    private client: Client | null = null;
    private connected: boolean = false;
    private subscriptions: Map<string | number, { unsubscribe: () => void }> = new Map();
    private pendingSubscriptions: (() => void)[] = [];
    private currentToken: string = '';

    ensureConnected(): void {
        const accessToken =
            useAuthStore.getState().accessToken;
        if (!accessToken || !WS_URL) {
            console.error(
                'WebSocket URL 또는 토큰이 없습니다.'
            );
            return;
        }

        if (
            this.client &&
            this.connected &&
            this.currentToken === accessToken
        ) {
            return;
        }

        if (this.client) {
            this.client.deactivate();
        }

        this.currentToken = accessToken;
        this.client = new Client({
            brokerURL: WS_URL,
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                this.connected = true;
                this.pendingSubscriptions.forEach((fn) =>
                    fn()
                );
                this.pendingSubscriptions = [];
            },
            onDisconnect: () => {
                this.connected = false;
            },
            onStompError: (frame) => {
                console.error(
                    'STOMP 에러:',
                    frame.headers['message']
                );
            },
            onWebSocketError: (event: Event) => {
                console.error('WebSocket 에러:', event);
            },
        });

        this.client.activate();
    }

    subscribe(chatRoomId: string | number | null | undefined, onMessage: (message: ChatMessage) => void): () => void {
        if (!chatRoomId) return () => {};

        this.ensureConnected();

        const subscribeAction = () => {
            if (!this.client || !this.connected) return;
            const subscription = this.client.subscribe(
                `/sub/chat.${chatRoomId}`,
                (message: IMessage) => {
                    try {
                        const payload = JSON.parse(
                            message.body
                        ) as ChatMessage;
                        onMessage(payload);
                    } catch (error) {
                        console.error(
                            '메시지 파싱 오류:',
                            error
                        );
                    }
                }
            );
            this.subscriptions.set(
                chatRoomId,
                subscription
            );
        };

        if (this.connected) {
            subscribeAction();
        } else {
            this.pendingSubscriptions.push(subscribeAction);
        }

        return () => this.unsubscribe(chatRoomId);
    }

    unsubscribe(chatRoomId: string | number): void {
        const subscription =
            this.subscriptions.get(chatRoomId);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(chatRoomId);
        }
    }

    sendMessage({ chatRoomId, content, scope = 'APP' }: { chatRoomId: string | number; content: string; scope?: Scope }): void {
        if (!content || !content.trim()) return;
        this.ensureConnected();
        if (!this.client || !this.connected) {
            console.error(
                'WebSocket이 연결되지 않았습니다.'
            );
            return;
        }

        const destination =
            scope === 'MANAGER'
                ? `/pub/manager/send.${chatRoomId}`
                : `/pub/app/send.${chatRoomId}`;

        this.client.publish({
            destination,
            body: JSON.stringify({ content }),
        });
    }

    disconnect(): void {
        this.subscriptions.forEach((subscription) =>
            subscription.unsubscribe()
        );
        this.subscriptions.clear();
        if (this.client) {
            this.client.deactivate();
            this.client = null;
        }
        this.connected = false;
        this.pendingSubscriptions = [];
    }
}

export const chatSocketManager = new ChatSocketManager();

