import useAuthStore from '../store/authStore';

const backend = import.meta.env.VITE_API_URL;

const getBasePath = (scope) =>
    scope === 'MANAGER' ? 'manager' : 'app';

const request = async ({
    path,
    method = 'GET',
    body,
    scope = 'APP',
}) => {
    const accessToken = useAuthStore.getState().accessToken;

    const response = await fetch(
        `${backend}/${getBasePath(scope)}/chat${path}`,
        {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: body ? JSON.stringify(body) : undefined,
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || '채팅 API 오류');
    }

    return response.json();
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
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    if (pageSize) params.append('pageSize', pageSize);

    return request({
        path: `/rooms?${params.toString()}`,
        scope,
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
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    if (pageSize) params.append('pageSize', pageSize);

    return request({
        path: `/rooms/${chatRoomId}/messages?${params.toString()}`,
        scope,
    });
};
