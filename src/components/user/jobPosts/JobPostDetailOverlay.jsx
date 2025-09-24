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
import { getPostDetail } from '../../../services/post';

const JobPostDetailOverlay = ({
    postId,
    onClose,
    onApply,
}) => {
    const [postDetail, setPostDetail] = useState(null);
    const [loading, setLoading] = useState(true);

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
        if (onApply) {
            onApply(postDetail);
        }
    };

    if (loading) {
        return (
            <Overlay>
                <Container>
                    <PageHeader
                        title='로딩 중...'
                        onBack={onClose}
                        variant='sticky'
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
                        title='공고를 찾을 수 없습니다'
                        onBack={onClose}
                        variant='sticky'
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
                    variant='sticky'
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
                    postId={postDetail.id}
                    onApply={handleApply}
                />
            </Container>
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
`;

const Content = styled.div`
    flex: 1;
    overflow-y: auto;
    padding-top: 20px;
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
