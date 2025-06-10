import styled from 'styled-components';
import BookmarkButton from '../jobPosts/Bookmark';
import { paymentTypeToKorean } from '../../utils/paymentUtils';
import { formatNumber } from '../../utils/formatNumber';
import { timeAgo } from '../../utils/timeUtil';
import {
    addPostingScrap,
    deletePostingScrap,
} from '../../services/post';

const ScrappedPostItem = ({
    title,
    createdAt,
    paymentType,
    payAmount,
    businessName,
    onClick,
    id,
}) => {
    return (
        <InfoContainer onClick={onClick}>
            <CompanyName>{businessName}</CompanyName>
            <TopRow>
                <Title>{title}</Title>
            </TopRow>
            <Description>
                {paymentTypeToKorean(paymentType)}
                <WageHighlight>
                    {formatNumber(payAmount)}
                </WageHighlight>
                원 · 업무내용없네용 · {timeAgo(createdAt)}
            </Description>
        </InfoContainer>
    );
};

export default ScrappedPostItem;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 390px;
    padding: 16px 20px;
    box-sizing: border-box;
    gap: 5px;
    border-bottom: 1px solid #f6f6f6;
    cursor: pointer;
`;

const Title = styled.div`
    width: 300px;
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    box-sizing: border-box; /* 패딩/보더 포함한 크기 계산 */
    overflow: hidden; /* 넘치는 내용 숨김 */
    white-space: nowrap; /* 줄바꿈 없이 한 줄로 표시 */
    text-overflow: ellipsis; /* 넘치면 ...으로 표시 */
`;

const TopRow = styled.div`
    display: flex;
    align-items: center;
    gap: 25px;
`;

const CompanyName = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
`;

const Description = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
`;

const WageHighlight = styled.span`
    color: #399982;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
`;
