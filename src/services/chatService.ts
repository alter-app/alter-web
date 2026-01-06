import apiClient from '../utils/apiClient';

type Scope = 'APP' | 'MANAGER';

interface RequestConfig {
    path: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    scope?: Scope;
    params?: Record<string, unknown>;
}

const getBasePath = (scope: Scope): string =>
    scope === 'MANAGER' ? 'manager' : 'app';

const request = async ({
    path,
    method = 'GET',
    body,
    scope = 'APP',
    params,
}: RequestConfig): Promise<unknown> => {
    const basePath = getBasePath(scope);
    const config: {
        method: string;
        url: string;
        data?: unknown;
        params?: Record<string, unknown>;
    } = {
        method,
        url: `/${basePath}/chat${path}`,
    };

    if (body) {
        config.data = body;
    }

    if (params) {
        config.params = params;
    }

    try {
        const response = await apiClient(config);
        return response.data;
    } catch (error) {
        const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
        throw new Error(
            axiosError.response?.data?.message || axiosError.message || '채팅 API 오류'
        );
    }
};

interface CreateChatRoomParams {
    opponentUserId: string | number;
    opponentScope: Scope;
    scope?: Scope;
}

export const createChatRoom = async ({
    opponentUserId,
    opponentScope,
    scope = 'APP',
}: CreateChatRoomParams): Promise<unknown> =>
    request({
        path: '/rooms',
        method: 'POST',
        scope,
        body: {
            opponentUserId,
            opponentScope,
        },
    });

interface GetChatRoomsParams {
    cursor?: string | null;
    pageSize?: number;
    scope?: Scope;
}

export const getChatRooms = async ({
    cursor,
    pageSize = 10,
    scope = 'APP',
}: GetChatRoomsParams): Promise<unknown> => {
    const params: Record<string, string | number> = {};
    if (cursor) params.cursor = cursor;
    if (pageSize) params.pageSize = pageSize;

    return request({
        path: '/rooms',
        method: 'GET',
        scope,
        params,
    });
};

interface GetChatRoomDetailParams {
    chatRoomId: string | number;
    scope?: Scope;
}

export const getChatRoomDetail = async ({
    chatRoomId,
    scope = 'APP',
}: GetChatRoomDetailParams): Promise<unknown> =>
    request({
        path: `/rooms/${chatRoomId}`,
        scope,
    });

interface GetChatMessagesParams {
    chatRoomId: string | number;
    cursor?: string | null;
    pageSize?: number;
    scope?: Scope;
}

export const getChatMessages = async ({
    chatRoomId,
    cursor,
    pageSize = 20,
    scope = 'APP',
}: GetChatMessagesParams): Promise<unknown> => {
    const params: Record<string, string | number> = {};
    if (cursor) params.cursor = cursor;
    if (pageSize) params.pageSize = pageSize;

    return request({
        path: `/rooms/${chatRoomId}/messages`,
        method: 'GET',
        scope,
        params,
    });
};

