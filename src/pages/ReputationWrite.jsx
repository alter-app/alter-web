import styled from 'styled-components';
import {
    getUserReputationKeywords,
    getManagerReputationKeywords,
    submitReputation,
} from '../services/reputationService';
import {
    createWorkerReputation,
    userSubmitReputation,
} from '../services/myJob';
import { createWorkerReputationByManager } from '../services/managerPage';
import useAuthStore from '../store/authStore';
import KeywordList from '../components/owner/reputation/KeywordList';
import EpisodeInputCard from '../components/owner/reputation/EpisodeInputCard';
import PageHeader from '../components/shared/PageHeader';
import CompletionModal from '../components/shared/CompletionModal';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ReputationWrite = () => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [allKeywords, setAllKeywords] = useState([]);
    const [categories, setCategories] = useState([]);
    const [episodeInputs, setEpisodeInputs] = useState({});
    const [
        isCompletionModalOpen,
        setIsCompletionModalOpen,
    ] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const requestId = location.state?.requestId;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { scope } = useAuthStore.getState();

            // scope에 따라 적절한 함수 호출
            const result =
                scope === 'APP'
                    ? await getUserReputationKeywords()
                    : await getManagerReputationKeywords();

            const categoriesData = result.data.categories;
            const keywords = categoriesData.reduce(
                (acc, curr) => acc.concat(curr.keywords),
                []
            );
            setCategories(categoriesData);
            setAllKeywords(keywords);
            console.log(categoriesData);
            console.log(
                '현재 scope:',
                scope,
                '키워드:',
                keywords
            );
        } catch (error) {
            console.error('평판 키워드 조회 오류:', error);
        }
    };

    // scope에 따른 텍스트 설정
    const { scope } = useAuthStore.getState();
    const isAppScope = scope === 'APP';

    const subtitleText = isAppScope
        ? '이 업장의 어떤 점이 인상적이었나요?'
        : '이 알바생의 어떤 점이 인상적이었나요?';

    const noticeText = isAppScope
        ? '이 업장에게 어울리는 키워드를 골라주세요'
        : '이 알바생에게 어울리는 키워드를 골라주세요';

    const handleKeywordClick = (id) => {
        setSelectedIds((prev) => {
            if (prev.includes(id)) {
                const updatedInputs = { ...episodeInputs };
                delete updatedInputs[id];
                setEpisodeInputs(updatedInputs);
                return prev.filter((v) => v !== id);
            }
            if (prev.length >= 5) return prev;
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
            // 근무자 평판인 경우
            if (location.state?.type === 'worker') {
                const { scope } = useAuthStore.getState();

                // 매니저가 근무자에게 평판을 생성하는 경우
                if (scope === 'MANAGER') {
                    await createWorkerReputationByManager({
                        workspaceId: parseInt(
                            location.state.workplaceId
                        ),
                        targetUserId: parseInt(
                            location.state.employeeId
                        ),
                        keywordsPayload: keywordsPayload,
                    });
                } else {
                    // 사용자(APP)가 업장에 평판을 생성하는 경우
                    await createWorkerReputation(
                        location.state.workplaceId,
                        keywordsPayload
                    );
                }
            } else {
                // scope에 따라 적절한 API 사용
                const { scope } = useAuthStore.getState();
                if (scope === 'APP') {
                    // 사용자(APP)일 때 userSubmitReputation 사용
                    await userSubmitReputation(
                        requestId,
                        keywordsPayload
                    );
                } else {
                    // 매니저일 때 submitReputation 사용
                    await submitReputation(
                        requestId,
                        keywordsPayload
                    );
                }
            }

            // 완료 모달 표시
            setIsCompletionModalOpen(true);
        } catch (error) {
            alert(
                `평판 저장 중 오류 발생: ${error.message}`
            );
        }
    };

    const handleCompletionModalClose = () => {
        setIsCompletionModalOpen(false);
        navigate(-1);
    };

    return (
        <Overlay>
            <Container>
                <PageHeader title='평판 작성' />
                <Content>
                    <FormCard>
                        <SubTitle>{subtitleText}</SubTitle>
                        <NoticeText>
                            {noticeText}
                        </NoticeText>
                        <KeywordList
                            selectedIds={selectedIds}
                            onKeywordClick={
                                handleKeywordClick
                            }
                            allKeywords={allKeywords}
                            categories={categories}
                        />
                        <NoticeText>
                            키워드는 최소 2개, 최대 5개까지
                            선택할 수 있습니다.
                        </NoticeText>

                        {selectedIds.length > 0 && (
                            <>
                                <Divider />
                                <EpisodeSection>
                                    <EpisodeSubTitle>
                                        선택한 키워드에 대한
                                        에피소드를
                                        작성해주세요
                                    </EpisodeSubTitle>
                                    <EpisodeInputCard
                                        selectedIds={
                                            selectedIds
                                        }
                                        allKeywords={
                                            allKeywords
                                        }
                                        episodeInputs={
                                            episodeInputs
                                        }
                                        onInputChange={
                                            handleInputChange
                                        }
                                    />
                                </EpisodeSection>
                            </>
                        )}
                    </FormCard>
                </Content>
                <StyledButton onClick={handleSave}>
                    작성 완료
                </StyledButton>
            </Container>

            <CompletionModal
                isOpen={isCompletionModalOpen}
                onClose={handleCompletionModalClose}
                icon='✅'
                title='평판 작성 완료!'
                description='평판이 성공적으로 작성되었습니다. 다른 사용자들에게 도움이 될 거예요.'
                buttonText='확인'
            />
        </Overlay>
    );
};

export default ReputationWrite;
const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: flex-end;
`;

const Container = styled.div`
    width: 100%;
    height: 100%;
    background: #ffffff;
    /* border-radius: 20px 20px 0 0; */
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-top: 60px;

    @media (max-width: 480px) {
        /* border-radius: 16px 16px 0 0; */
    }

    @media (max-width: 360px) {
        border-radius: 12px 12px 0 0;
    }
`;

const Content = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 24px 20px 0px 20px;
    -webkit-overflow-scrolling: touch;

    @supports (padding: max(0px)) {
        padding-left: max(20px, env(safe-area-inset-left));
        padding-right: max(
            20px,
            env(safe-area-inset-right)
        );
    }

    @media (max-width: 480px) {
        padding: 20px 16px 0px 16px;

        @supports (padding: max(0px)) {
            padding-left: max(
                16px,
                env(safe-area-inset-left)
            );
            padding-right: max(
                16px,
                env(safe-area-inset-right)
            );
        }
    }

    @media (max-width: 360px) {
        padding: 16px 12px 0px 12px;

        @supports (padding: max(0px)) {
            padding-left: max(
                12px,
                env(safe-area-inset-left)
            );
            padding-right: max(
                12px,
                env(safe-area-inset-right)
            );
        }
    }
`;

const SubTitle = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 24px;
    line-height: 24px;

    @media (max-width: 480px) {
        font-size: 20px;
        line-height: 22px;
    }

    @media (max-width: 360px) {
        font-size: 18px;
        line-height: 20px;
    }
`;

const NoticeText = styled.div`
    color: #959595;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    line-height: 18px;
    margin-top: 3px;
    margin-bottom: 22px;

    @media (max-width: 480px) {
        font-size: 14px;
        line-height: 16px;
        margin-bottom: 20px;
    }

    @media (max-width: 360px) {
        font-size: 12px;
        line-height: 14px;
        margin-bottom: 18px;
    }
`;

const StyledButton = styled.button`
    width: calc(100% - 40px);
    height: 48px;
    border: none;
    background: #2de283;
    color: #ffffff;
    font-size: 16px;
    font-family: 'Pretendard';
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(45, 226, 131, 0.3);
    margin: 16px 20px;
    position: sticky;
    bottom: 0;
    z-index: 10;

    &:hover {
        background: #25c973;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(45, 226, 131, 0.4);
    }

    &:active {
        background: #1fb865;
        transform: translateY(0);
        box-shadow: 0 2px 6px rgba(45, 226, 131, 0.3);
    }

    @media (max-width: 480px) {
        height: 44px;
        font-size: 14px;
        border-radius: 6px;
        margin: 12px 16px;
        width: calc(100% - 32px);
    }

    @media (max-width: 360px) {
        height: 40px;
        font-size: 13px;
        border-radius: 6px;
        margin: 10px 12px;
        width: calc(100% - 24px);
    }

    @supports (padding: max(0px)) {
        margin-bottom: max(
            25px,
            env(safe-area-inset-bottom)
        );

        @media (max-width: 480px) {
            margin-bottom: max(env(safe-area-inset-bottom));
        }

        @media (max-width: 360px) {
            margin-bottom: max(
                20px,
                env(safe-area-inset-bottom)
            );
        }
    }
`;

const FormCard = styled.div`
    /* margin-bottom: 16px;
    padding: 16px;

    @media (max-width: 480px) {
        border-radius: 6px;
        margin-bottom: 12px;
        padding: 14px;
    }

    @media (max-width: 360px) {
        border-radius: 6px;
        margin-bottom: 10px;
        padding: 12px;
    } */
`;

const Divider = styled.div`
    width: 100%;
    height: 1px;
    background-color: #e0e0e0;
    margin: 20px 0;

    @media (max-width: 480px) {
        margin: 16px 0;
    }

    @media (max-width: 360px) {
        margin: 12px 0;
    }
`;

const EpisodeSection = styled.div`
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

const EpisodeSubTitle = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;

    @media (max-width: 480px) {
        font-size: 16px;
        line-height: 20px;
    }

    @media (max-width: 360px) {
        font-size: 14px;
        line-height: 18px;
    }
`;
