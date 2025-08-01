import styled from 'styled-components';
import { timeAgo } from '../../../../utils/timeUtil';

function JobPostTitleBox({
    title,
    createdAt,
    keywords,
    workspace,
}) {
    return (
        <TitleBox>
            <Row>
                <CompanyName>{workspace.name}</CompanyName>
                <PostTime>{timeAgo(createdAt)}</PostTime>
            </Row>
            <Title>{title}</Title>
            <JobTagWrapper>
                {keywords.map((keywords) => (
                    <JobTagList key={keywords.id}>
                        {keywords.name}
                    </JobTagList>
                ))}
            </JobTagWrapper>
        </TitleBox>
    );
}

export default JobPostTitleBox;

const TitleBox = styled.div`
    width: 390px;
    height: 125px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 18px 20px;
    box-sizing: border-box;
    background-color: #ffffff;
`;

const Row = styled.div`
    display: flex;
    justify-content: space-between;
`;

const CompanyName = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
`;

const PostTime = styled.div`
    display: inline-block;
    padding: 0 5px;
    border-radius: 4px;
    background: #f6f6f6;
    color: #399982;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
`;

const Title = styled.div`
    width: 350px;
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 24px;
    line-height: 34px;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

const JobTagWrapper = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`;

const JobTagList = styled.div`
    display: inline-block;
    padding: 0 5px;
    border-radius: 4px;
    background: #f6f6f6;
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
`;
