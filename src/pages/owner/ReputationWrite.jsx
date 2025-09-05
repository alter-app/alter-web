import styled from 'styled-components';
import {
    getReputationKeywords,
    submitReputation,
} from '../../services/reputationService';
import KeywordList from '../../components/owner/reputation/KeywordList';
import EpisodeInputCard from '../../components/owner/reputation/EpisodeInputCard';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ReputationWrite = () => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [allKeywords, setAllKeywords] = useState([]);
    const [episodeInputs, setEpisodeInputs] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const requestId = location.state?.requestId;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await getReputationKeywords();
            const categories = result.data.categories;
            const keywords = categories.reduce(
                (acc, curr) => acc.concat(curr.keywords),
                []
            );
            setAllKeywords(keywords);
            console.log(allKeywords);
        } catch (error) {
            console.error('평판 키워드 조회 오류:', error);
        }
    };

    const handleKeywordClick = (id) => {
        setSelectedIds((prev) => {
            if (prev.includes(id)) {
                const updatedInputs = { ...episodeInputs };
                delete updatedInputs[id];
                setEpisodeInputs(updatedInputs);
                return prev.filter((v) => v !== id);
            }
            if (prev.length >= 3) return prev;
            return [...prev, id];
        });
    };

    const handleInputChange = (id, value) => {
        setEpisodeInputs((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSave = async () => {
        const keywordsPayload = selectedIds.map((id) => ({
            keywordId: id,
            description: episodeInputs[id] || '',
        }));

        if (keywordsPayload.length < 2) {
            alert(
                '키워드는 최소 2개 이상 선택해야 합니다.'
            );
            return;
        }

        try {
            await submitReputation(
                requestId,
                keywordsPayload
            );
            navigate('/main');
        } catch (error) {
            alert(
                `평판 저장 중 오류 발생: ${error.message}`
            );
        }
    };

    return (
        <Container>
            <Title>평판 작성</Title>
            <FormCard>
                <SubTitle>
                    이 알바생의 어떤 점이 인상적이었나요?
                </SubTitle>
                <NoticeText>
                    이 알바생에게 어울리는 키워드를
                    골라주세요
                </NoticeText>
                <KeywordList
                    selectedIds={selectedIds}
                    onKeywordClick={handleKeywordClick}
                    allKeywords={allKeywords}
                />
                <NoticeText>
                    키워드는 최소 2개, 최대 3개까지 선택할
                    수 있습니다.
                </NoticeText>
                <EpisodeInputCard
                    selectedIds={selectedIds}
                    allKeywords={allKeywords}
                    episodeInputs={episodeInputs}
                    onInputChange={handleInputChange}
                />
            </FormCard>
            <StyledButton onClick={handleSave}>
                저장하기
            </StyledButton>
        </Container>
    );
};

export default ReputationWrite;
const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 50px 20vw;
`;

const Title = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 32px;
    line-height: 42px;
`;

const SubTitle = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 24px;
    line-height: 24px;
`;

const NoticeText = styled.div`
    color: #959595;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 15px;
    line-height: 24px;
    margin-top: 5px;
    margin-bottom: 20px;
`;

const StyledButton = styled.button`
    width: 100%;
    height: 48px;
    border: none;
    background: #2de283;
    color: #ffffff;
    font-size: 16px;
    line-height: 20px;
    font-family: 'Pretendard';
    font-weight: 400;
    border-radius: 8px;
    cursor: pointer;
`;

const FormCard = styled.div`
    background-color: #ffffff;
    border-radius: 8px;
    margin-top: 30px;
    margin-bottom: 30px;
    padding: 30px;
`;
