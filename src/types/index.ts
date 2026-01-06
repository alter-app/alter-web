// API 응답 타입
export interface ApiResponse<T = unknown> {
    data: T;
    message?: string;
}

// 인증 관련 타입
export interface AuthData {
    accessToken: string;
    refreshToken: string;
    authorizationId: string;
    scope: 'USER' | 'MANAGER' | 'APP';
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

// 공고 관련 타입
export interface PostListParams {
    cursorInfo?: string;
    search?: string;
    province?: string;
    district?: string;
    town?: string;
    minPayAmount?: string;
    maxPayAmount?: string;
    startTime?: string;
    endTime?: string;
}

export interface PostingApplyParams {
    postingId: string | number;
    description: string;
    postingScheduleId: string | number;
}

// 스크랩 관련 타입
export interface ScrapParams {
    postingId: string | number;
}

export interface DeleteScrapParams {
    favoritePostingId: string | number;
}

export interface ScrapListParams {
    cursorInfo?: string;
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
    data: T[];
    page?: {
        cursor?: string;
        totalCount?: number;
    };
}

// 알림 타입
export interface Notification {
    id: string | number;
    title: string;
    body: string;
    createdAt: string;
}

// 평판 타입
export interface Reputation {
    id: string | number;
    workplaceName?: string;
    reviewerName?: string;
    targetName?: string;
    timeAgo?: string;
    rating?: number;
    isNew?: boolean;
    requesterType?: string;
}

// 대타 요청 타입
export interface SubstituteRequest {
    id: string | number;
    workspaceName?: string;
    requesterName?: string;
    scheduleDate?: string;
    scheduleTime?: string;
    position?: string;
    timeAgo?: string;
    status?: string;
    statusDescription?: string;
    requestReason?: string;
}

// 스케줄 타입
export interface Schedule {
    id: string | number;
    day?: string;
    date?: string;
    workplace?: string;
    time?: string;
    hours?: string;
    startDateTime?: string;
    endDateTime?: string;
}

// 지원 타입
export interface Application {
    id: string | number;
    [key: string]: unknown;
}

// 업장 타입
export interface Workplace {
    id: string | number;
    name?: string;
    [key: string]: unknown;
}

