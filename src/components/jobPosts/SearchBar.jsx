import styled from "styled-components";
import searchSvg from "../../assets/icons/searchSvg.svg";

const SearchBarContainer = styled.div`
    width: 350px;
    height: 46px;
    display: flex;
    align-items: center;
    border: 1px solid #d9d9d9;
    border-radius: 8px;
    background: #ffffff;
    padding: 0 16px;
    box-sizing: border-box;
    margin-left: 20px;
    margin-top: 26px;
`;

const SearchInput = styled.input`
    flex: 1;
    height: 100%;
    border: none;
    outline: none;
    font-size: 18px;
    background: transparent;
`;

const SearchIcon = styled.span`
    color: #bdbdbd;
    font-size: 22px;
    display: flex;
    align-items: center;
`;

const SearchBar = ({ value, onChange }) => (
    <SearchBarContainer>
        <SearchInput
            type="text"
            value={value}
            onChange={onChange}
        />
        <SearchIcon>
            <img
                src={searchSvg}
                alt="검색"
                width={22}
                height={22}
            />
        </SearchIcon>
    </SearchBarContainer>
);

export default SearchBar;
