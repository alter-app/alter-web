import styled from 'styled-components';
import JobPostTitleBox from './jobPostDetail/JobPostTitleBox';
import JobPostWorkInfo from './jobPostDetail/JobPostWorkInfo';
import WorkLocation from './jobPostDetail/WorkLocation';
import DetailSection from './jobPostDetail/DetailSection';
import JobDetailFooter from './jobPostDetail/JobDetailFooter';
import { getPostDetail } from '../../../services/post';
import { useState, useEffect } from 'react';
import closeIcon from '../../../assets/icons/closeIcon.svg';

function JobPostDetail({
    onClose,
    id,
    scrapMap,
    onScrapChange,
}) {
    const [detail, setDetail] = useState(null);

    useEffect(() => {
        getPostDetail(id).then((res) =>
            setDetail(res.data)
        );
    }, [id]);

    if (!detail) return <div>로딩 중...</div>;

    return (
        <>
            <Container>
                <CloseButtonDiv>
                    <CloseButton
                        src={closeIcon}
                        alt='닫기'
                        onClick={onClose}
                    />
                </CloseButtonDiv>
                <PhotoBox>
                    <PhotoImg
                        src='사진주소.jpg'
                        alt='알바 사진 들어올 곳'
                    />
                </PhotoBox>
                <Gap>
                    <JobPostTitleBox
                        title={detail.title}
                        createdAt={detail.createdAt}
                        keywords={detail.keywords}
                        workspace={detail.workspace}
                    />
                    <JobPostWorkInfo
                        paymentType={detail.paymentType}
                        payAmount={detail.payAmount}
                        schedules={detail.schedules}
                    />
                    <WorkLocation />
                    <DetailSection
                        description={detail.description}
                    />
                </Gap>
            </Container>
            <StickyFooter>
                <JobDetailFooter
                    id={detail.id}
                    checked={
                        scrapMap[detail.id] ??
                        detail.scrapped
                    }
                    onScrapChange={(value) =>
                        onScrapChange(detail.id, value)
                    }
                />
            </StickyFooter>
        </>
    );
}

export default JobPostDetail;

const PhotoBox = styled.div`
    width: 390px;
    height: 200px;
    background-color: #eee; /* 임시 배경색 */
    overflow: hidden; /* 이미지가 넘칠 경우 자르기 */
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0; /* 높이 줄어드는 것 방지 */
`;

const PhotoImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const Gap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Container = styled.div`
    width: 90vw;
    height: calc(100vh - 110px);
    max-width: 390px;
    background: #f6f6f6;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.25);
    box-sizing: border-box;
    overflow: auto;
    display: flex;
    flex-direction: column;
    padding-bottom: 64px;
`;

const StickyFooter = styled.div`
    position: sticky;
    left: 0;
    bottom: 10px;
    background: transparent; /* 투명 배경 */
    width: 100%;
    z-index: 10;
    background: #fff; /* 필요시 배경색 추가 */
`;

const CloseButtonDiv = styled.div`
    display: flex;
    justify-content: end;
`;
const CloseButton = styled.img`
    cursor: pointer;
    width: 18px;
    height: 18px;
    position: absolute;
    margin-top: 10px;
    margin-right: 10px;
`;
