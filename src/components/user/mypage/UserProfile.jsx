import { useState, useEffect } from 'react';
import { getUserInfo } from '../../../services/myPage';
import { formatJoinDate } from '../../../utils/timeUtil';
import userIcon from '../../../assets/icons/userIcon.png';
import styled from 'styled-components';

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState({
        name: '',
        nickname: '',
        createdAt: '',
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

    return (
        <ProfileContainer>
            <ProfileContent>
                <ProfileImg src={userIcon} alt='프로필' />
                <ProfileInfo>
                    <ProfileName>{userInfo.name || '이름'}</ProfileName>
                    <ProfileNickname>{userInfo.nickname || '닉네임'}</ProfileNickname>
                    <CreatedAt>
                        가입일자 : {formatJoinDate(userInfo.createdAt)}
                    </CreatedAt>
                </ProfileInfo>
            </ProfileContent>
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
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #999999;
`;
