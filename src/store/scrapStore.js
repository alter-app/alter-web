import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    addPostingScrap,
    deletePostingScrap,
} from '../services/post';

const useScrapStore = create(
    persist(
        (set, get) => ({
            // 스크랩 상태 맵 (postId -> boolean)
            scrapMap: {},

            // 스크랩 상태 초기화 (서버에서 가져온 데이터로)
            initializeScrapMap: (posts) => {
                const scrapMap = {};
                posts.forEach((post) => {
                    if (post.scrapped !== undefined) {
                        scrapMap[post.id] = post.scrapped;
                    }
                });
                set({ scrapMap });
            },

            // 개별 포스트 스크랩 상태 설정
            setScrapStatus: (postId, isScrapped) => {
                set((state) => ({
                    scrapMap: {
                        ...state.scrapMap,
                        [postId]: isScrapped,
                    },
                }));
            },

            // 스크랩 토글 (낙관적 업데이트)
            toggleScrap: async (postId) => {
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
            isScrapped: (postId) => {
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
            partialize: (state) => ({
                scrapMap: state.scrapMap,
            }),
        }
    )
);

export default useScrapStore;
