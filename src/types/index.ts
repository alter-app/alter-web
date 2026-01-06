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
    scope: 'USER' | 'MANAGER';
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

