import JobPostItem from "./JobPostItem";
import styled from "styled-components";
import SearchBar from "./SearchBar";

const jobs = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
];

const JobPostList = () => {
    return (
        <Container>
            <SearchBar />
            <Divider />
            <ListArea>
                <Address>서울 구로구 경인로 445</Address>
                {jobs.map((job) => (
                    <JobPostItem key={job.id} />
                ))}
            </ListArea>
        </Container>
    );
};

export default JobPostList;

const Container = styled.div`
    width: 390px;
    height: 100vh; /* 화면 전체 높이 */
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
`;

const ListArea = styled.div`
    flex: 1;
    overflow-y: auto;
    min-height: 0; /* flexbox에서 overflow 작동 위해 필요 */
`;

const Address = styled.div`
    font-family: "Pretendard";
    font-weight: 600;
    font-size: 24px;
    line-height: 34px;
    margin-left: 20px;
`;

const Divider = styled.div`
    width: 100%;
    max-width: 390px;
    height: 1px;
    background: #f6f6f6;
    margin: 25px 0 16px 0;
`;
