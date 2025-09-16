import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import JobPostTitleBox from '../../components/user/jobPosts/jobPostDetail/JobPostTitleBox';
import JobPostWorkInfo from '../../components/user/jobPosts/jobPostDetail/JobPostWorkInfo';
import WorkLocation from '../../components/user/jobPosts/jobPostDetail/WorkLocation';
import DetailSection from '../../components/user/jobPosts/jobPostDetail/DetailSection';
import WorkplaceReputation from '../../components/user/jobPosts/jobPostDetail/WorkplaceReputation';
import KeywordList from '../../components/user/jobPosts/jobPostDetail/KeywordList';
import JobDetailFooter from '../../components/user/jobPosts/jobPostDetail/JobDetailFooter';
import Divider from '../../components/user/jobPosts/jobPostDetail/Divider';
import { getPostDetail } from '../../services/post';

const JobPostDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [postDetail, setPostDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const postId = location.state?.id;
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
    }, [location.state?.id]);

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <Container>
                <Header>
                    <BackButton onClick={handleBack}>
                        <BackIcon>
                            <svg
                                width='24'
                                height='24'
                                viewBox='0 0 24 24'
                                fill='none'
                            >
                                <path
                                    d='M15 18L9 12L15 6'
                                    stroke='#333'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        </BackIcon>
                    </BackButton>
                    <HeaderTitle>로딩 중...</HeaderTitle>
                </Header>
                <Content>
                    <LoadingText>
                        공고 정보를 불러오는 중...
                    </LoadingText>
                </Content>
            </Container>
        );
    }

    if (!postDetail) {
        return (
            <Container>
                <Header>
                    <BackButton onClick={handleBack}>
                        <BackIcon>
                            <svg
                                width='24'
                                height='24'
                                viewBox='0 0 24 24'
                                fill='none'
                            >
                                <path
                                    d='M15 18L9 12L15 6'
                                    stroke='#333'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        </BackIcon>
                    </BackButton>
                    <HeaderTitle>
                        공고를 찾을 수 없습니다
                    </HeaderTitle>
                </Header>
                <Content>
                    <ErrorText>
                        요청하신 공고를 찾을 수 없습니다.
                    </ErrorText>
                </Content>
            </Container>
        );
    }

    return (
        <Container>
            <Header>
                <BackButton onClick={handleBack}>
                    <BackIcon>
                        <svg
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                        >
                            <path
                                d='M15 18L9 12L15 6'
                                stroke='#333'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                        </svg>
                    </BackIcon>
                </BackButton>
                <HeaderTitle>알바 상세</HeaderTitle>
            </Header>

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
                onApply={() =>
                    navigate('/job-apply', {
                        state: { id: postDetail.id },
                    })
                }
            />
        </Container>
    );
};

export default JobPostDetail;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: 100dvh;
    width: 100vw;
    max-width: 100vw;
    background: #ffffff;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;

    /* iOS Safari safe area */
    @supports (padding: max(0px)) {
        padding-left: max(0px, env(safe-area-inset-left));
        padding-right: max(0px, env(safe-area-inset-right));
        padding-top: max(0px, env(safe-area-inset-top));
        padding-bottom: max(
            0px,
            env(safe-area-inset-bottom)
        );
    }

    /* 모바일 웹뷰 최적화 */
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
`;

const Header = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    padding: 0 16px;
    z-index: 100;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    @supports (padding: max(0px)) {
        padding-top: max(0px, env(safe-area-inset-top));
        height: calc(
            60px + max(0px, env(safe-area-inset-top))
        );
    }

    @media (max-width: 480px) {
        height: 56px;
        padding: 0 12px;

        @supports (padding: max(0px)) {
            height: calc(
                56px + max(0px, env(safe-area-inset-top))
            );
        }
    }

    @media (max-width: 360px) {
        height: 52px;
        padding: 0 10px;

        @supports (padding: max(0px)) {
            height: calc(
                52px + max(0px, env(safe-area-inset-top))
            );
        }
    }
`;

const BackButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s ease;
    -webkit-tap-highlight-color: transparent;

    &:hover {
        background: #f5f5f5;
    }

    &:active {
        background: #e0e0e0;
        transform: scale(0.95);
    }

    @media (max-width: 480px) {
        width: 36px;
        height: 36px;
    }

    @media (max-width: 360px) {
        width: 32px;
        height: 32px;
    }
`;

const BackIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const HeaderTitle = styled.h1`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 18px;
    color: #333333;
    margin: 0;
    margin-left: 12px;

    @media (max-width: 480px) {
        font-size: 16px;
        margin-left: 10px;
    }

    @media (max-width: 360px) {
        font-size: 15px;
        margin-left: 8px;
    }
`;

const Content = styled.div`
    flex: 1;
    overflow-y: auto;
    padding-top: 60px;
    padding-bottom: 160px;
    -webkit-overflow-scrolling: touch;

    @supports (padding: max(0px)) {
        padding-top: calc(
            60px + max(0px, env(safe-area-inset-top))
        );
        padding-bottom: calc(
            160px + max(0px, env(safe-area-inset-bottom))
        );
    }

    @media (max-width: 480px) {
        padding-top: 56px;
        padding-bottom: 150px;

        @supports (padding: max(0px)) {
            padding-top: calc(
                56px + max(0px, env(safe-area-inset-top))
            );
            padding-bottom: calc(
                150px +
                    max(0px, env(safe-area-inset-bottom))
            );
        }
    }

    @media (max-width: 360px) {
        padding-top: 52px;
        padding-bottom: 140px;

        @supports (padding: max(0px)) {
            padding-top: calc(
                52px + max(0px, env(safe-area-inset-top))
            );
            padding-bottom: calc(
                140px +
                    max(0px, env(safe-area-inset-bottom))
            );
        }
    }
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
