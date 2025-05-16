import styled from "styled-components";
import JobPostDetail from "../components/jobPosts/JobPostDetail";
import JobPostList from "../components/jobPosts/JobPostList";
import NaverMap from "../components/jobPosts/NaverMap";

const JobLookupMap = () => {
    return (
        <MapContainer>
            <StyledNaverMap>
                <NaverMap />
            </StyledNaverMap>
            <JobPost>
                <List>
                    <JobPostList />
                </List>
                <Detail>
                    <JobPostDetail />
                </Detail>
            </JobPost>
        </MapContainer>
    );
};

export default JobLookupMap;

const MapContainer = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
`;

const StyledNaverMap = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
`;

const JobPost = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 810px;
    display: flex;
    z-index: 2;
    gap: 12px;
`;

const List = styled.div`
    width: 390px;
    height: 100vh;
    background: #fff;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
    z-index: 3;
`;

const Detail = styled.div`
    height: 100vh;
    background: #fff;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
    z-index: 3;
`;
