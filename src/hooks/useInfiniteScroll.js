import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * InfiniteScroll과 페이지네이션 로직을 관리하는 커스텀 훅
 * @param {Object} options
 * @param {Function} options.fetchFunction - 데이터를 가져오는 함수 (cursor를 인자로 받음)
 * @param {Array} options.dependencies - fetchFunction이 의존하는 값들의 배열
 * @param {boolean} options.enabled - 훅이 활성화되어야 하는 조건 (기본값: true)
 * @param {boolean} options.initialLoad - 초기 로드 여부 (기본값: true)
 * @returns {Object} { items, hasMore, totalCount, loadMore, reset, isLoading }
 */
const useInfiniteScroll = ({
    fetchFunction,
    dependencies = [],
    enabled = true,
    initialLoad = true,
}) => {
    const [items, setItems] = useState([]);
    const [cursor, setCursor] = useState('');
    const [totalCount, setTotalCount] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // cursor를 ref로 관리하여 dependency 문제 해결
    const cursorRef = useRef('');

    useEffect(() => {
        cursorRef.current = cursor;
    }, [cursor]);

    const fetchData = useCallback(
        async ({ reset = false } = {}) => {
            if (!enabled) return;

            setIsLoading(true);
            try {
                const requestCursor = reset ? '' : cursorRef.current;

                if (reset) {
                    setCursor('');
                    cursorRef.current = '';
                }

                const result = await fetchFunction(requestCursor);

                // API 응답 형식: { data: [], page: { cursor, totalCount } }
                const newItems = result?.data || [];
                const pageInfo = result?.page || {};

                setItems((prev) =>
                    reset ? newItems : [...prev, ...newItems]
                );

                const newCursor = pageInfo.cursor || '';
                setCursor(newCursor);
                cursorRef.current = newCursor;
                setTotalCount(pageInfo.totalCount || 0);
                setHasMore(!!newCursor);
            } catch (error) {
                console.error('데이터 조회 오류:', error);
                if (reset) {
                    setItems([]);
                    setCursor('');
                    cursorRef.current = '';
                    setHasMore(false);
                    setTotalCount(0);
                }
            } finally {
                setIsLoading(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [enabled, fetchFunction, ...dependencies]
    );

    // 초기 로드
    useEffect(() => {
        if (initialLoad && enabled) {
            fetchData({ reset: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, initialLoad, ...dependencies]);

    const loadMore = useCallback(() => {
        if (hasMore && !isLoading && enabled) {
            fetchData({ reset: false });
        }
    }, [hasMore, isLoading, enabled, fetchData]);

    const reset = useCallback(() => {
        setItems([]);
        setCursor('');
        cursorRef.current = '';
        setHasMore(true);
        setTotalCount(0);
        if (enabled) {
            fetchData({ reset: true });
        }
    }, [enabled, fetchData]);

    return {
        items,
        hasMore,
        totalCount,
        loadMore,
        reset,
        isLoading,
        cursor,
    };
};

export default useInfiniteScroll;

