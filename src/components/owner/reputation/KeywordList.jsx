import KeywordButton from './KeywordButton';
import styled from 'styled-components';

const KeywordList = ({
    selectedIds,
    onKeywordClick,
    allKeywords,
}) => {
    return (
        <KeywordListWrapper>
            {allKeywords.map((item) => (
                <KeywordButton
                    key={item.id}
                    {...item}
                    onClick={() => onKeywordClick(item.id)}
                    selected={selectedIds.includes(item.id)}
                />
            ))}
        </KeywordListWrapper>
    );
};

export default KeywordList;

const KeywordListWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    width: 100%;
`;
