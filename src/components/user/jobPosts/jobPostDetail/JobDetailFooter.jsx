import styled from 'styled-components';
import Bookmark from '../Bookmark';
import { useNavigate } from 'react-router-dom';
import {
    addPostingScrap,
    deletePostingScrap,
} from '../../../../services/post';

const JobDetailFooter = ({
    id,
    checked,
    onScrapChange,
}) => {
    const navigate = useNavigate();

    const handleApply = () => {
        navigate('/apply', {
            state: { id: id },
        });
    };

    const handleBookmark = async (e) => {
        e.stopPropagation();
        const nextChecked = !checked;
        onScrapChange(nextChecked);

        try {
            if (nextChecked) {
                await addPostingScrap({ postingId: id });
            } else {
                await deletePostingScrap({
                    favoritePostingId: id,
                });
            }
        } catch (error) {
            alert('스크랩 실패');
            onScrapChange(checked);
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
    max-width: 390px;
    height: 64px;
    display: flex;
    z-index: 1000;
    box-shadow: 0px -1px 4px 0px rgba(0, 0, 0, 0.25);
`;

const BookmarkButtonWrapper = styled.div`
    width: 64px;
    height: 64px;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
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
`;
