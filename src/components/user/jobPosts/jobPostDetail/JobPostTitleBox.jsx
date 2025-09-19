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
                <CompanyName>
                    {workspace?.name || '회사명 없음'}
                </CompanyName>
                <PostTime>{timeAgo(createdAt)}</PostTime>
            </Row>
            <Title>{title}</Title>
            <JobTagWrapper>
                {keywords &&
                    keywords.length > 0 &&
                    keywords.map((keyword) => (
                        <JobTagList key={keyword.id}>
                            {keyword.name}
                        </JobTagList>
                    ))}
            </JobTagWrapper>
        </TitleBox>
    );
}

export default JobPostTitleBox;

const TitleBox = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 18px 20px;
    box-sizing: border-box;
    background-color: #ffffff;

    @media (max-width: 480px) {
        padding: 16px 16px;
        gap: 6px;
    }

    @media (max-width: 360px) {
        padding: 14px 12px;
        gap: 4px;
    }
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

    @media (max-width: 480px) {
        font-size: 13px;
        line-height: 18px;
    }

    @media (max-width: 360px) {
        font-size: 12px;
        line-height: 16px;
    }
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

    @media (max-width: 480px) {
        font-size: 11px;
        line-height: 18px;
        padding: 0 4px;
    }

    @media (max-width: 360px) {
        font-size: 10px;
        line-height: 16px;
        padding: 0 3px;
    }
`;

const Title = styled.div`
    width: 100%;
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 24px;
    line-height: 34px;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    @media (max-width: 480px) {
        font-size: 20px;
        line-height: 28px;
    }

    @media (max-width: 360px) {
        font-size: 18px;
        line-height: 26px;
    }
`;

const JobTagWrapper = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    @media (max-width: 480px) {
        gap: 6px;
    }

    @media (max-width: 360px) {
        gap: 4px;
    }
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

    @media (max-width: 480px) {
        font-size: 11px;
        line-height: 18px;
        padding: 0 4px;
    }

    @media (max-width: 360px) {
        font-size: 10px;
        line-height: 16px;
        padding: 0 3px;
    }
`;
