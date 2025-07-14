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
            <Row>
                <ProfileImg src={userIcon} alt='프로필' />
                <Column>
                    <ProfileName>
                        {userInfo.name}
                    </ProfileName>
                    <ProfileNickname>
                        닉네임 : {userInfo.nickname}
                    </ProfileNickname>
                    <CreatedAt>
                        가입일자 :{' '}
                        {formatJoinDate(userInfo.createdAt)}
                    </CreatedAt>
                </Column>
            </Row>
        </ProfileContainer>
    );
};

export default UserProfile;

const ProfileContainer = styled.div`
    padding: 30px 0px;
`;

const ProfileImg = styled.img`
    width: 150px;
    height: 150px;
`;

const ProfileName = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 28px;
    line-height: 38px;
    color: #111111;
`;

const ProfileNickname = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 20px;
    line-height: 26px;
    color: #999999;
`;

const CreatedAt = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 18px;
    color: #999999;
`;

const Row = styled.div`
    display: flex;
    gap: 30px;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    height: 150px;
    padding-top: 20px;
    box-sizing: border-box;
    gap: 10px;
`;
