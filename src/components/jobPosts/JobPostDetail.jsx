import styled from "styled-components";
import JobPostTitleBox from "./jobPostDetail/JobPostTitleBox";
import JobPostWorkInfo from "./jobPostDetail/JobPostWorkInfo";
import WorkLocation from "./jobPostDetail/WorkLocation";
import DetailSection from "./jobPostDetail/DetailSection";
import JobDetailFooter from "./jobPostDetail/JobDetailFooter";

function JobPostDetail({ children }) {
    return (
        <Shadow>
            <Container>
                <PhotoBox>
                    <PhotoImg
                        src="사진주소.jpg"
                        alt="알바 사진 들어올 곳"
                    />
                </PhotoBox>
                <Gap>
                    <JobPostTitleBox />
                    <JobPostWorkInfo />
                    <WorkLocation />
                    <DetailSection />
                </Gap>
            </Container>
            <JobDetailFooter />
        </Shadow>
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
    position: fixed;
    top: 90px;
    bottom: 10px;
    width: 90vw;
    height: calc(100vh - 110px);
    max-width: 390px;
    max-height: 1000px;
    min-height: 400px;
    background: #f6f6f6;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
    box-sizing: border-box;
    overflow: auto;
    display: flex;
    flex-direction: column;
    padding-bottom: 64px;
`;

const Shadow = styled.div`
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.25);
`;
