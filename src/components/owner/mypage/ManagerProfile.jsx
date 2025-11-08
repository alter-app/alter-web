import styled from 'styled-components';
import { formatJoinDate } from '../../../utils/timeUtil';
import userIcon from '../../../assets/icons/userIcon.png';

const ManagerProfile = ({ manager }) => {
    const { name, nickname, createdAt } = manager || {};

    return (
        <ProfileCard>
            <ProfileHeader>
                <AvatarWrapper>
                    <AvatarImage
                        src={userIcon}
                        alt='프로필 이미지'
                    />
                </AvatarWrapper>
                <ProfileText>
                    <NameText>
                        {name || '이름 미등록'}
                    </NameText>
                    <NicknameText>
                        {nickname
                            ? `닉네임 ${nickname}`
                            : '닉네임 미등록'}
                    </NicknameText>
                    <JoinDateText>
                        가입일{' '}
                        {createdAt
                            ? formatJoinDate(createdAt)
                            : '-'}
                    </JoinDateText>
                </ProfileText>
            </ProfileHeader>
        </ProfileCard>
    );
};

export default ManagerProfile;

const ProfileCard = styled.section`
    background: linear-gradient(
        140deg,
        #ffffff 0%,
        #f6fbf9 100%
    );
    border-radius: 16px;
    border: 1px solid #e9f2ef;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(24, 89, 70, 0.08);
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const ProfileHeader = styled.div`
    display: flex;
    gap: 16px;
    align-items: center;
`;

const AvatarWrapper = styled.div`
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid #d8ebe3;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
`;

const AvatarImage = styled.img`
    width: 64px;
    height: 64px;
    object-fit: cover;
`;

const ProfileText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const NameText = styled.p`
    margin: 0;
    font-family: 'Pretendard';
    font-weight: 700;
    font-size: 22px;
    color: #174d3b;
`;

const NicknameText = styled.p`
    margin: 0;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 16px;
    color: #4f6f65;
`;

const JoinDateText = styled.p`
    margin: 0;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    color: #7a9188;
`;
