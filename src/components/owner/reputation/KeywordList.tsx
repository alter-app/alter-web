import KeywordButton from './KeywordButton';
import styled from 'styled-components';

const KeywordList = ({
    selectedIds,
    onKeywordClick,
    allKeywords,
    categories,
}) => {
    return (
        <KeywordListWrapper>
            {categories?.map((category) => (
                <CategorySection
                    key={
                        category.category?.value ||
                        category.id
                    }
                >
                    <CategoryTitle>
                        {category.category?.description ||
                            category.name}
                    </CategoryTitle>
                    <CategoryKeywords>
                        {category.keywords
                            ?.reduce(
                                (acc, keyword, index) => {
                                    if (index % 2 === 0) {
                                        acc.push([]);
                                    }
                                    acc[
                                        acc.length - 1
                                    ].push(keyword);
                                    return acc;
                                },
                                []
                            )
                            .map(
                                (
                                    keywordPair,
                                    pairIndex
                                ) => (
                                    <KeywordRow
                                        key={pairIndex}
                                    >
                                        {keywordPair.map(
                                            (keyword) => (
                                                <KeywordButton
                                                    key={
                                                        keyword.id
                                                    }
                                                    {...keyword}
                                                    onClick={() =>
                                                        onKeywordClick(
                                                            keyword.id
                                                        )
                                                    }
                                                    selected={selectedIds.includes(
                                                        keyword.id
                                                    )}
                                                />
                                            )
                                        )}
                                    </KeywordRow>
                                )
                            )}
                    </CategoryKeywords>
                </CategorySection>
            ))}
        </KeywordListWrapper>
    );
};

export default KeywordList;

const KeywordListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    gap: 24px;
    width: 100%;
    padding-bottom: 10px;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        display: none;
    }

    @media (max-width: 480px) {
        gap: 20px;
        padding-bottom: 8px;
    }

    @media (max-width: 360px) {
        gap: 16px;
        padding-bottom: 6px;
    }
`;

const CategorySection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;

    @media (max-width: 480px) {
        gap: 8px;
    }

    @media (max-width: 360px) {
        gap: 6px;
    }
`;

const CategoryTitle = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 20px;
    line-height: 22px;
    margin-bottom: 4px;

    @media (max-width: 480px) {
        font-size: 18px;
        line-height: 20px;
        margin-bottom: 3px;
    }

    @media (max-width: 360px) {
        font-size: 16px;
        line-height: 18px;
        margin-bottom: 2px;
    }
`;

const CategoryKeywords = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;

    @media (max-width: 480px) {
        gap: 10px;
    }

    @media (max-width: 360px) {
        gap: 8px;
    }
`;

const KeywordRow = styled.div`
    display: flex;
    gap: 12px;
    justify-content: flex-start;

    @media (max-width: 480px) {
        gap: 10px;
    }

    @media (max-width: 360px) {
        gap: 8px;
    }
`;
