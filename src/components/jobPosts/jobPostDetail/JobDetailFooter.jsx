import styled from 'styled-components';
import Bookmark from '../Bookmark';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JobDetailFooter = ({ id }) => {
    const [checked, setChecked] = useState(false);
    const navigate = useNavigate();

    const handleApply = () => {
        navigate('/apply', {
            state: { id: id },
        });
    };

    return (
        <ApplyButtonBar>
            <BookmarkButton>
                <Bookmark
                    id={`bookmark-toggle-${id}`}
                    checked={checked}
                    onChange={() =>
                        setChecked((prev) => !prev)
                    }
                />
            </BookmarkButton>
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

const BookmarkButton = styled.div`
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
