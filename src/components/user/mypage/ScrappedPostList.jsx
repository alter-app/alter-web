import styled from 'styled-components';
import { getScrapPostList } from '../../../services/myPage';
import { useEffect, useState, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../../Loader';
import { formatNumber } from '../../../utils/formatNumber';
import { timeAgo } from '../../../utils/timeUtil';
import JobPostDetailOverlay from '../jobPosts/JobPostDetailOverlay';
import useScrapStore from '../../../store/scrapStore';

const ScrappedPostList = ({ isActive }) => {
    const [scrappedPosts, setScrappedPosts] = useState([]);
    const [cursorInfo, setCursorInfo] = useState('');
    const [totalCount, setTotalCount] = useState(0);
    const [hasInitialLoad, setHasInitialLoad] =
        useState(false);
    const [showDetailOverlay, setShowDetailOverlay] =
        useState(false);
    const [selectedPostId, setSelectedPostId] =
        useState(null);
    const containerRef = useRef(null);

    // 스크랩 전역 상태 사용
    const { scrapMap, initializeScrapMap } =
        useScrapStore();

    useEffect(() => {
        if (!hasInitialLoad) {
            fetchData();
            setHasInitialLoad(true);
        }
    }, [hasInitialLoad]);

    // 스크랩 상태 변경 시 리스트 필터링
    useEffect(() => {
        setScrappedPosts((prev) =>
            prev.filter(
                (scrap) =>
                    scrapMap[scrap.posting.id] !== false
            )
        );
    }, [scrapMap]);

    const fetchData = async (isRefresh = false) => {
        try {
            const result = await getScrapPostList({
                cursorInfo: isRefresh ? '' : cursorInfo,
            });

            if (isRefresh) {
                setScrappedPosts(result.data);
            } else {
                setScrappedPosts((prev) => [
                    ...prev,
                    ...result.data,
                ]);
            }
            setCursorInfo(result.page.cursor);
            setTotalCount(result.page.totalCount);

            // 스크랩 상태 초기화 (모든 스크랩된 포스트는 true로 설정)
            const posts = result.data.map((scrap) => ({
                ...scrap.posting,
                scrapped: true,
            }));
            initializeScrapMap(posts);

            console.log(result);
        } catch (error) {
            console.error('공고 리스트 조회 오류:', error);
        }
    };

    const formatPaymentType = (paymentType) => {
        return paymentType === 'HOURLY' ? '시급' : '일급';
    };

    // 공고 상세 오버레이 열기
    const handleOpenDetailOverlay = (postId) => {
        setSelectedPostId(postId);
        setShowDetailOverlay(true);
    };

    // 공고 상세 오버레이 닫기
    const handleCloseDetailOverlay = () => {
        setShowDetailOverlay(false);
        setSelectedPostId(null);
    };

    // 지원하기 핸들러
    const handleApply = (postDetail) => {
        console.log('지원하기:', postDetail);
        // 지원 로직은 필요에 따라 구현
    };

    // 스크랩 상태 변경 핸들러
    const handleScrapChange = (postId, isScrapped) => {
        if (!isScrapped) {
            // 스크랩 해제 시 해당 아이템을 리스트에서 제거
            setScrappedPosts((prev) =>
                prev.filter(
                    (scrap) => scrap.posting.id !== postId
                )
            );
        }
    };

    if (scrappedPosts.length === 0) {
        return (
            <EmptyContainer>
                <EmptyIcon>📄</EmptyIcon>
                <EmptyText>
                    스크랩한 공고가 없습니다.
                </EmptyText>
            </EmptyContainer>
        );
    }

    if (!isActive) {
        return null;
    }

    return (
        <Container>
            <ListArea
                id='scrollableListArea'
                ref={containerRef}
            >
                <InfiniteScroll
                    dataLength={scrappedPosts.length}
                    next={() => fetchData(false)}
                    hasMore={
                        scrappedPosts.length < totalCount
                    }
                    loader={
                        <CenteredDiv>
                            <Loader />
                        </CenteredDiv>
                    }
                    endMessage={null}
                    scrollableTarget='scrollableListArea'
                >
                    {scrappedPosts.map((scrap) => (
                        <ScrapCard
                            key={scrap.id}
                            onClick={() =>
                                handleOpenDetailOverlay(
                                    scrap.posting.id
                                )
                            }
                        >
                            <ScrapContent>
                                <BusinessName>
                                    {
                                        scrap.posting
                                            .businessName
                                    }
                                </BusinessName>
                                <JobTitle>
                                    {scrap.posting.title}
                                </JobTitle>
                                <JobInfo>
                                    {formatPaymentType(
                                        scrap.posting
                                            .paymentType
                                    )}{' '}
                                    <Amount>
                                        {formatNumber(
                                            scrap.posting
                                                .payAmount
                                        )}
                                    </Amount>
                                    원 ·{' '}
                                    {timeAgo(
                                        scrap.createdAt
                                    )}
                                </JobInfo>
                            </ScrapContent>
                        </ScrapCard>
                    ))}
                </InfiniteScroll>
            </ListArea>

            {/* JobPostDetail 오버레이 */}
            {showDetailOverlay && selectedPostId && (
                <JobPostDetailOverlay
                    postId={selectedPostId}
                    onClose={handleCloseDetailOverlay}
                    onApply={handleApply}
                    onScrapChange={handleScrapChange}
                />
            )}
        </Container>
    );
};

export default ScrappedPostList;

const Container = styled.div`
    width: 100%;
    height: 100%;
    background-color: transparent;
    display: flex;
    flex-direction: column;
`;

const ListArea = styled.div`
    flex: 1;
    overflow-y: auto;
    min-height: 0;
`;

const CenteredDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
`;

const EmptyContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 300px;
    background: #ffffff;
    margin: 2px 0;
`;

const EmptyIcon = styled.div`
    font-size: 80px;
    margin-bottom: 16px;
`;

const EmptyText = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    color: #999999;
`;

const ScrapCard = styled.div`
    background: #ffffff;
    margin: 2px 0;
    padding: 16px 20px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #f8f9fa;
    }
`;

const ScrapContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const BusinessName = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #999999;
`;

const JobTitle = styled.div`
    font-family: 'Pretendard';
    font-weight: 700;
    font-size: 16px;
    color: #111111;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const JobInfo = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #999999;
`;

const Amount = styled.span`
    color: #2de283;
    font-weight: 700;
`;
