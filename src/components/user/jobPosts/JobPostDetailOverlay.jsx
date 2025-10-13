import { useState, useEffect } from 'react';
import styled from 'styled-components';
import JobPostTitleBox from './jobPostDetail/JobPostTitleBox';
import JobPostWorkInfo from './jobPostDetail/JobPostWorkInfo';
import WorkLocation from './jobPostDetail/WorkLocation';
import DetailSection from './jobPostDetail/DetailSection';
import WorkplaceReputation from './jobPostDetail/WorkplaceReputation';
import KeywordList from './jobPostDetail/KeywordList';
import JobDetailFooter from './jobPostDetail/JobDetailFooter';
import Divider from './jobPostDetail/Divider';
import PageHeader from '../../shared/PageHeader';
import JobApplyOverlay from './JobApplyOverlay';
import CompletionModal from '../../shared/CompletionModal';
import { getPostDetail } from '../../../services/post';
import useScrapStore from '../../../store/scrapStore';

const JobPostDetailOverlay = ({
    postId,
    onClose,
    onApply,
    onScrapChange,
}) => {
    const [postDetail, setPostDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showApplyOverlay, setShowApplyOverlay] =
        useState(false);
    const [showCompletionModal, setShowCompletionModal] =
        useState(false);

    // 스크랩 전역 상태 사용
    const { isScrapped, toggleScrap } = useScrapStore();

    // 스크랩 상태 변경 핸들러
    const handleScrapChange = async (postId) => {
        try {
            await toggleScrap(postId);
            // 상위 컴포넌트에 스크랩 상태 변경 알림
            if (onScrapChange) {
                onScrapChange(postId, isScrapped(postId));
            }
        } catch (error) {
            console.error('스크랩 처리 실패:', error);
        }
    };

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                if (postId) {
                    const result = await getPostDetail(
                        postId
                    );
                    setPostDetail(result.data);
                    console.log(result);
                }
            } catch (error) {
                console.error(
                    '공고 상세 조회 오류:',
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetail();
    }, [postId]);

    const handleApply = () => {
        setShowApplyOverlay(true);
    };

    const handleCloseApplyOverlay = () => {
        setShowApplyOverlay(false);
    };

    const handleApplySuccess = () => {
        // 지원 오버레이 닫기
        setShowApplyOverlay(false);
        // 지원 성공 모달 표시
        setShowCompletionModal(true);
    };

    const handleCloseCompletionModal = () => {
        setShowCompletionModal(false);
    };

    // 스크랩 상태를 store에서 가져옴
    const scrapped = isScrapped(postId);

    if (loading) {
        return (
            <Overlay>
                <Container>
                    <PageHeader
                        title='알바 상세'
                        onBack={onClose}
                    />
                    <Content>
                        <LoadingText>
                            공고 정보를 불러오는 중...
                        </LoadingText>
                    </Content>
                </Container>
            </Overlay>
        );
    }

    if (!postDetail) {
        return (
            <Overlay>
                <Container>
                    <PageHeader
                        title='알바 상세'
                        onBack={onClose}
                    />
                    <Content>
                        <ErrorText>
                            요청하신 공고를 찾을 수
                            없습니다.
                        </ErrorText>
                    </Content>
                </Container>
            </Overlay>
        );
    }

    return (
        <Overlay>
            <Container>
                <PageHeader
                    title='알바 상세'
                    onBack={onClose}
                />

                <Content>
                    <JobPostTitleBox
                        title={postDetail.title}
                        workspace={postDetail.workspace}
                        createdAt={postDetail.createdAt}
                        keywords={postDetail.keywords || []}
                    />

                    <Divider />

                    <JobPostWorkInfo
                        paymentType={postDetail.paymentType}
                        payAmount={postDetail.payAmount}
                        schedules={postDetail.schedules}
                    />

                    <Divider />

                    <WorkLocation
                        workspace={postDetail.workspace}
                    />

                    <Divider />

                    <DetailSection
                        title='상세 내용'
                        description={
                            postDetail?.description ||
                            '업무 내용이 없습니다.'
                        }
                    />

                    <Divider />

                    <WorkplaceReputation
                        workspace={postDetail?.workspace}
                    />

                    <Divider />

                    <KeywordList
                        workspace={postDetail?.workspace}
                    />
                </Content>

                <JobDetailFooter
                    id={postDetail.id}
                    checked={scrapped}
                    onScrapChange={handleScrapChange}
                    onApply={handleApply}
                />
            </Container>

            {/* JobApply 오버레이 */}
            {showApplyOverlay && (
                <JobApplyOverlay
                    postId={postDetail.id}
                    onClose={handleCloseApplyOverlay}
                    onApplySuccess={handleApplySuccess}
                />
            )}

            {/* 지원 완료 모달 */}
            <CompletionModal
                isOpen={showCompletionModal}
                onClose={handleCloseCompletionModal}
                icon='🎉'
                title='지원 완료!'
                description='공고 지원이 성공적으로 완료되었습니다. 매니저의 검토 후 연락드릴 예정입니다.'
                buttonText='확인'
            />
        </Overlay>
    );
};

export default JobPostDetailOverlay;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: flex-end;
`;

const Container = styled.div`
    width: 100%;
    height: 100%;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-top: 60px;
`;

const Content = styled.div`
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
`;

const LoadingText = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    color: #666666;
`;

const ErrorText = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    color: #666666;
`;
