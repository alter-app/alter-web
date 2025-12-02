import apiClient from '../utils/apiClient';

const getBasePath = (scope) =>
    scope === 'MANAGER' ? 'manager' : 'app';

const request = async ({
    path,
    method = 'GET',
    body,
    scope = 'APP',
    params,
}) => {
    const basePath = getBasePath(scope);
    const config = {
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
        throw new Error(
            error.response?.data?.message || error.message || '채팅 API 오류'
        );
    }
};

export const createChatRoom = async ({
    opponentUserId,
    opponentScope,
    scope = 'APP',
}) =>
    request({
        path: '/rooms',
        method: 'POST',
        scope,
        body: {
            opponentUserId,
            opponentScope,
        },
    });

export const getChatRooms = async ({
    cursor,
    pageSize = 10,
    scope = 'APP',
}) => {
    const params = {};
    if (cursor) params.cursor = cursor;
    if (pageSize) params.pageSize = pageSize;

    return request({
        path: '/rooms',
        method: 'GET',
        scope,
        params,
    });
};

export const getChatRoomDetail = async ({
    chatRoomId,
    scope = 'APP',
}) =>
    request({
        path: `/rooms/${chatRoomId}`,
        scope,
    });

export const getChatMessages = async ({
    chatRoomId,
    cursor,
    pageSize = 20,
    scope = 'APP',
}) => {
    const params = {};
    if (cursor) params.cursor = cursor;
    if (pageSize) params.pageSize = pageSize;

    return request({
        path: `/rooms/${chatRoomId}/messages`,
        method: 'GET',
        scope,
        params,
    });
};
