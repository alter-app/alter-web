import styled from 'styled-components';
import searchSvg from '../../../assets/icons/searchSvg.svg';

const SearchBarContainer = styled.div`
    width: calc(100% - 40px);
    height: 46px;
    display: flex;
    align-items: center;
    border: 1px solid #d9d9d9;
    border-radius: 8px;
    background: #ffffff;
    padding: 0 16px;
    box-sizing: border-box;
    margin: 20px 20px 0 20px;
    transition: all 0.2s ease;
    -webkit-tap-highlight-color: transparent;

    &:focus-within {
        border-color: #399982;
        box-shadow: 0 0 0 2px rgba(57, 153, 130, 0.1);
    }

    @media (max-width: 768px) {
        width: calc(100% - 32px);
        height: 42px;
        margin: 16px 16px 0 16px;
        padding: 0 14px;
        min-height: 44px; /* 터치 친화적 최소 높이 */
    }

    @media (max-width: 480px) {
        width: calc(100% - 24px);
        height: 40px;
        margin: 14px 12px 0 12px;
        padding: 0 12px;
        min-height: 44px; /* 터치 친화적 최소 높이 */
    }

    @media (max-width: 360px) {
        width: calc(100% - 20px);
        height: 38px;
        margin: 12px 10px 0 10px;
        padding: 0 10px;
        min-height: 44px; /* 터치 친화적 최소 높이 */
    }

    @media (max-width: 320px) {
        width: calc(100% - 16px);
        height: 36px;
        margin: 10px 8px 0 8px;
        padding: 0 8px;
        min-height: 44px; /* 터치 친화적 최소 높이 */
    }
`;

const SearchInput = styled.input`
    flex: 1;
    height: 100%;
    border: none;
    outline: none;
    font-size: 18px;
    background: transparent;
    font-family: 'Pretendard';
    font-weight: 400;
    color: #333333;

    &::placeholder {
        color: #999999;
        font-size: 16px;
    }

    @media (max-width: 768px) {
        font-size: 16px;

        &::placeholder {
            font-size: 15px;
        }
    }

    @media (max-width: 480px) {
        font-size: 15px;

        &::placeholder {
            font-size: 14px;
        }
    }

    @media (max-width: 360px) {
        font-size: 14px;

        &::placeholder {
            font-size: 13px;
        }
    }

    @media (max-width: 320px) {
        font-size: 13px;

        &::placeholder {
            font-size: 12px;
        }
    }
`;

const SearchIcon = styled.span`
    color: #bdbdbd;
    font-size: 22px;
    display: flex;
    align-items: center;
    flex-shrink: 0;

    img {
        width: 22px;
        height: 22px;
        transition: all 0.2s ease;
    }

    @media (max-width: 768px) {
        font-size: 20px;

        img {
            width: 20px;
            height: 20px;
        }
    }

    @media (max-width: 480px) {
        font-size: 18px;

        img {
            width: 18px;
            height: 18px;
        }
    }

    @media (max-width: 360px) {
        font-size: 16px;

        img {
            width: 16px;
            height: 16px;
        }
    }

    @media (max-width: 320px) {
        font-size: 14px;

        img {
            width: 14px;
            height: 14px;
        }
    }
`;

const SearchBar = ({
    value,
    onChange,
    placeholder = '검색어를 입력하세요',
}) => (
    <SearchBarContainer>
        <SearchInput
            type='text'
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
        <SearchIcon>
            <img src={searchSvg} alt='검색' />
        </SearchIcon>
    </SearchBarContainer>
);

export default SearchBar;
