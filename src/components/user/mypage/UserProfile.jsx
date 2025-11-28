import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../../../services/myPage';
import { formatJoinDate } from '../../../utils/timeUtil';
import userIcon from '../../../assets/icons/userIcon.png';
import styled from 'styled-components';

const UserProfile = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        name: '',
        nickname: '',
        createdAt: '',
        reputationSummary: {
            topKeywords: [],
        },
    });

    // 사용자 정보 조회 요청
    useEffect(() => {
        const fetchUserInfo = async () => {
            const result = await getUserInfo();
            setUserInfo(result.data);
        };
        fetchUserInfo();
        console.log(userInfo);
    }, []);

    const handleSettingsClick = () => {
        navigate('/settings');
    };

    return (
        <ProfileContainer>
            <ProfileContent>
                <ProfileImg src={userIcon} alt='프로필' />
                <ProfileInfo>
                    <NameRow>
                        <ProfileName>{userInfo.name || '이름'}</ProfileName>
                        <KebabButton
                            type='button'
                            onClick={handleSettingsClick}
                            aria-label='설정'
                        >
                            <KebabDots>
                                <span />
                                <span />
                                <span />
                            </KebabDots>
                        </KebabButton>
                    </NameRow>
                    <ProfileNickname>
                        {userInfo.nickname || '닉네임'}
                    </ProfileNickname>
                    <CreatedAt>
                        가입일자 : {formatJoinDate(userInfo.createdAt)}
                    </CreatedAt>
                </ProfileInfo>
            </ProfileContent>
            {userInfo.reputationSummary?.topKeywords?.length > 0 && (
                <KeywordsSection>
                    <KeywordsLabel>내가 받은 평판 키워드</KeywordsLabel>
                    <KeywordsList>
                        {userInfo.reputationSummary.topKeywords.map(
                            (keyword, index) => (
                                <KeywordBadge key={index}>
                                    <KeywordEmoji>{keyword.emoji}</KeywordEmoji>
                                    <KeywordText>
                                        {keyword.description}
                                    </KeywordText>
                                    <KeywordCount>{keyword.count}</KeywordCount>
                                </KeywordBadge>
                            )
                        )}
                    </KeywordsList>
                </KeywordsSection>
            )}
        </ProfileContainer>
    );
};

export default UserProfile;

const ProfileContainer = styled.div`
    background: #ffffff;
    padding: 16px 20px;
`;

const ProfileContent = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const ProfileImg = styled.img`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
`;

const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
`;

const NameRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const KebabButton = styled.button`
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 8px;
    background: rgba(17, 17, 17, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
    -webkit-tap-highlight-color: transparent;
    flex-shrink: 0;

    &:hover {
        background: rgba(17, 17, 17, 0.08);
    }

    &:active {
        background: rgba(17, 17, 17, 0.12);
        transform: scale(0.94);
    }

    @media (max-width: 480px) {
        width: 28px;
        height: 28px;
        border-radius: 6px;
    }

    @media (max-width: 360px) {
        width: 24px;
        height: 24px;
    }
`;

const KebabDots = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3px;

    span {
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: #111111;
    }

    @media (max-width: 480px) {
        gap: 2.5px;

        span {
            width: 2.5px;
            height: 2.5px;
        }
    }
`;

const ProfileName = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    color: #111111;
`;

const ProfileNickname = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #999999;
`;

const CreatedAt = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #999999;
`;

const KeywordsSection = styled.div`
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
`;

const KeywordsLabel = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    color: #333333;
    margin-bottom: 12px;
`;

const KeywordsList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;

const KeywordBadge = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #f8f9fa;
    border-radius: 20px;
    border: 1px solid #e9ecef;
`;

const KeywordEmoji = styled.span`
    font-size: 16px;
`;

const KeywordText = styled.span`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 13px;
    color: #333333;
`;

const KeywordCount = styled.span`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 12px;
    color: #399982;
`;
