import styled from 'styled-components';
import { formatJoinDate } from '../../../utils/timeUtil';
import userIcon from '../../../assets/icons/userIcon.png';
import { useNavigate } from 'react-router-dom';
import settingIcon from '../../../assets/icons/setting.svg';

interface ManagerProfileProps {
    manager?: {
        name?: string;
        nickname?: string;
        createdAt?: string;
        [key: string]: unknown;
    };
}

const ManagerProfile = ({ manager }: ManagerProfileProps) => {
    const { name, nickname, createdAt } = manager || {};
    const navigate = useNavigate();

    const handleSettingsClick = () => {
        navigate('/owner/settings');
    };

    return (
        <ProfileContainer>
            <ProfileContent>
                <ProfileImg src={userIcon} alt='프로필' />
                <ProfileInfo>
                    <NameRow>
                        <ProfileName>
                            {name || '이름'}
                        </ProfileName>
                        <SettingButton
                            type='button'
                            onClick={handleSettingsClick}
                            aria-label='설정'
                        >
                            <SettingIcon
                                src={settingIcon}
                                alt='설정'
                            />
                        </SettingButton>
                    </NameRow>
                    <ProfileNickname>
                        {nickname || '닉네임'}
                    </ProfileNickname>
                    <CreatedAt>
                        가입일자 :{' '}
                        {createdAt
                            ? formatJoinDate(createdAt)
                            : '-'}
                    </CreatedAt>
                </ProfileInfo>
            </ProfileContent>
        </ProfileContainer>
    );
};

export default ManagerProfile;

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
    justify-content: space-between;
    gap: 8px;
`;

const SettingButton = styled.button`
    width: 44px;
    height: 44px;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;

    &:hover {
        opacity: 0.7;
    }

    &:active {
        opacity: 0.5;
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

const SettingIcon = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
`;
