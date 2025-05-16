import styled from "styled-components";
import Bookmark from "../Bookmark";
import { useState } from "react";

const JobDetailFooter = () => {
    const [checked, setChecked] = useState(false);

    return (
        <ApplyButtonBar>
            <BookmarkButton>
                <Bookmark
                    checked={checked}
                    onChange={() =>
                        setChecked((prev) => !prev)
                    }
                />
            </BookmarkButton>
            <ApplyButton>지원하기</ApplyButton>
        </ApplyButtonBar>
    );
};

export default JobDetailFooter;

const ApplyButtonBar = styled.div`
    position: fixed;
    bottom: 10px;
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
    font-family: "Pretendard";
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
`;
