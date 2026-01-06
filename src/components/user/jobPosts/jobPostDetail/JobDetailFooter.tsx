import styled from 'styled-components';
import Bookmark from '../Bookmark';
import useScrapStore from '../../../../store/scrapStore';

const JobDetailFooter = ({
    id,
    checked,
    onScrapChange,
    onApply,
}) => {
    // 스크랩 전역 상태 사용
    const { toggleScrap } = useScrapStore();
    const handleApply = () => {
        if (onApply) {
            onApply();
        }
    };

    const handleBookmark = async (e) => {
        e.stopPropagation();
        try {
            await toggleScrap(id);
        } catch (error) {
            console.error('스크랩 처리 실패:', error);
            alert('스크랩 처리에 실패했습니다.');
        }
    };

    return (
        <ApplyButtonBar>
            <BookmarkButtonWrapper>
                <Bookmark
                    id={`bookmark-toggle-${id}`}
                    checked={checked}
                    onChange={handleBookmark}
                />
            </BookmarkButtonWrapper>
            <ApplyButton onClick={handleApply}>
                지원하기
            </ApplyButton>
        </ApplyButtonBar>
    );
};

export default JobDetailFooter;

const ApplyButtonBar = styled.div`
    width: 100vw;
    max-width: 100vw;
    height: 64px;
    display: flex;
    z-index: 1000;
    box-shadow: 0px -1px 4px 0px rgba(0, 0, 0, 0.25);

    @media (max-width: 480px) {
        height: 60px;
    }

    @media (max-width: 360px) {
        height: 56px;
    }
`;

const BookmarkButtonWrapper = styled.div`
    width: 64px;
    height: 64px;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 480px) {
        width: 60px;
        height: 60px;
    }

    @media (max-width: 360px) {
        width: 56px;
        height: 56px;
    }
`;

const ApplyButton = styled.button`
    flex: 1;
    height: 64px;
    border: none;
    background-color: #2de283;
    color: #ffffff;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: #26c973;
    }

    &:active {
        background-color: #20b066;
        transform: scale(0.98);
    }

    @media (max-width: 480px) {
        height: 60px;
        font-size: 18px;
        line-height: 26px;
    }

    @media (max-width: 360px) {
        height: 56px;
        font-size: 16px;
        line-height: 24px;
    }
`;
