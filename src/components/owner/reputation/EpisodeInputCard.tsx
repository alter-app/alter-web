import styled from 'styled-components';

interface Keyword {
    id: string | number;
    emoji?: string;
    description?: string;
    [key: string]: unknown;
}

interface EpisodeInputCardProps {
    selectedIds: (string | number)[];
    allKeywords: Keyword[];
    episodeInputs: Record<string | number, string>;
    onInputChange: (id: string | number, value: string) => void;
}

const EpisodeInputCard = ({
    selectedIds,
    allKeywords,
    episodeInputs,
    onInputChange,
}: EpisodeInputCardProps) => {
    return (
        <EpisodeInputSection>
            {selectedIds.map((id: string | number) => {
                const keyword = allKeywords.find(
                    (k: Keyword) => k.id === id
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
    gap: 12px;

    @media (max-width: 480px) {
        gap: 10px;
    }

    @media (max-width: 360px) {
        gap: 8px;
    }
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 10px;

    @media (max-width: 480px) {
        gap: 8px;
        margin-bottom: 10px;
    }

    @media (max-width: 360px) {
        gap: 5px;
        margin-bottom: 10px;
    }
`;

const EpisodeLabel = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: #111111;
    display: flex;
    align-items: center;

    @media (max-width: 480px) {
        font-size: 14px;
        line-height: 18px;
    }

    @media (max-width: 360px) {
        font-size: 12px;
        line-height: 16px;
    }
`;

const EpisodeInput = styled.input`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 18px;
    box-sizing: border-box;
    padding: 25px 12px;
    width: 100%;
    height: 40px;
    outline: none;
    border: 1px solid transparent;
    border-radius: 6px;
    border-color: #f6f6f6;
    background-color: #f6f6f6;
    transition: all 0.2s ease;

    &::placeholder {
        color: #999999;
    }

    &:focus {
        outline: none;
        border: 1px solid #2de283;
        box-shadow: 0 0 0 3px rgba(45, 226, 131, 0.1);
    }

    @media (max-width: 480px) {
        font-size: 14px;
        line-height: 16px;
        padding: 20px 10px;
        height: 36px;
        border-radius: 4px;
    }

    @media (max-width: 360px) {
        font-size: 12px;
        line-height: 14px;
        padding: 18px 9px;
        height: 32px;
        border-radius: 4px;
    }
`;
