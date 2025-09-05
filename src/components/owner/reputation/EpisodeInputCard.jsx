import styled from 'styled-components';

const EpisodeInputCard = ({
    selectedIds,
    allKeywords,
    episodeInputs,
    onInputChange,
}) => {
    return (
        <EpisodeInputSection>
            {selectedIds.map((id) => {
                const keyword = allKeywords.find(
                    (k) => k.id === id
                );
                if (!keyword) return null;
                return (
                    <InputGroup key={id}>
                        <EpisodeLabel>
                            {keyword.emoji} ‘
                            {keyword.description}’에 대한
                            에피소드
                        </EpisodeLabel>
                        <EpisodeInput
                            placeholder='에피소드를 입력해주세요'
                            value={episodeInputs[id] || ''}
                            onChange={(e) =>
                                onInputChange(
                                    id,
                                    e.target.value
                                )
                            }
                        />{' '}
                    </InputGroup>
                );
            })}
        </EpisodeInputSection>
    );
};

export default EpisodeInputCard;

const EpisodeInputSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const EpisodeLabel = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    line-height: 28px;
    color: #111111;
    display: flex;
    align-items: center;
`;

const EpisodeInput = styled.input`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;
    box-sizing: border-box;
    padding: 13px 16px;
    width: 100%;
    height: 48px;
    outline: none;
    border: 1px solid transparent;
    border-radius: 8px;
    border-color: #f6f6f6;
    background-color: #f6f6f6;

    &::placeholder {
        color: #999999;
    }

    &:focus {
        outline: none;
        border: 1px solid #2de283;
    }
`;
