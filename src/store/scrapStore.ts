import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import {
    addPostingScrap,
    deletePostingScrap,
} from '../services/post';

interface Post {
    id: string | number;
    scrapped?: boolean;
}

interface ScrapState {
    // 스크랩 상태 맵 (postId -> boolean)
    scrapMap: Record<string | number, boolean>;

    // 액션
    initializeScrapMap: (posts: Post[]) => void;
    setScrapStatus: (postId: string | number, isScrapped: boolean) => void;
    toggleScrap: (postId: string | number) => Promise<void>;
    isScrapped: (postId: string | number) => boolean;
    clearScrapMap: () => void;
}

const useScrapStore = create(
    persist<ScrapState>(
        (set, get) => ({
            // 스크랩 상태 맵 (postId -> boolean)
            scrapMap: {},

            // 스크랩 상태 초기화 (서버에서 가져온 데이터로)
            initializeScrapMap: (posts: Post[]) => {
                const scrapMap: Record<string | number, boolean> = {};
                posts.forEach((post) => {
                    if (post.scrapped !== undefined) {
                        scrapMap[post.id] = post.scrapped;
                    }
                });
                set({ scrapMap });
            },

            // 개별 포스트 스크랩 상태 설정
            setScrapStatus: (postId: string | number, isScrapped: boolean) => {
                set((state) => ({
                    scrapMap: {
                        ...state.scrapMap,
                        [postId]: isScrapped,
                    },
                }));
            },

            // 스크랩 토글 (낙관적 업데이트)
            toggleScrap: async (postId: string | number) => {
                const currentState = get();
                const isCurrentlyScrapped =
                    currentState.scrapMap[postId] || false;
                const newScrappedState =
                    !isCurrentlyScrapped;

                // 낙관적 업데이트: UI를 먼저 업데이트
                set((state) => ({
                    scrapMap: {
                        ...state.scrapMap,
                        [postId]: newScrappedState,
                    },
                }));

                try {
                    if (newScrappedState) {
                        await addPostingScrap({
                            postingId: postId,
                        });
                    } else {
                        await deletePostingScrap({
                            favoritePostingId: postId,
                        });
                    }
                } catch (error) {
                    console.error(
                        '스크랩 처리 실패:',
                        error
                    );
                    // 실패 시 이전 상태로 롤백
                    set((state) => ({
                        scrapMap: {
                            ...state.scrapMap,
                            [postId]: isCurrentlyScrapped,
                        },
                    }));
                    throw error;
                }
            },

            // 특정 포스트의 스크랩 상태 확인
            isScrapped: (postId: string | number) => {
                return get().scrapMap[postId] || false;
            },

            // 스크랩 맵 초기화
            clearScrapMap: () => {
                set({ scrapMap: {} });
            },
        }),
        {
            name: 'scrap-storage',
            getStorage: () => localStorage,
            // scrapMap만 persist하고 다른 함수들은 제외
            partialize: (state: ScrapState) => ({
                scrapMap: state.scrapMap,
            }),
        } as unknown as PersistOptions<ScrapState, ScrapState>
    )
);

export default useScrapStore;

