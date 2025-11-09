import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { formatJoinDate } from '../../../utils/timeUtil';
import userIcon from '../../../assets/icons/userIcon.png';

const ManagerProfile = ({ manager }) => {
    const { name, nickname, createdAt } = manager || {};
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleToggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleMenuItemClick = (action) => () => {
        setIsMenuOpen(false);
        console.info(
            `[ManagerProfile] ${action} 메뉴가 선택되었습니다.`
        );
    };

    useEffect(() => {
        if (!isMenuOpen) {
            return undefined;
        }

        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener(
            'mousedown',
            handleClickOutside
        );
        document.addEventListener(
            'keydown',
            handleEscapeKey
        );

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
            document.removeEventListener(
                'keydown',
                handleEscapeKey
            );
        };
    }, [isMenuOpen]);

    return (
        <ProfileContainer>
            <ProfileHeader>
                <ProfileInfoGroup>
                    <ProfileImg
                        src={userIcon}
                        alt='프로필'
                    />
                    <ProfileInfo>
                        <ProfileName>
                            {name || '이름'}
                        </ProfileName>
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
                </ProfileInfoGroup>
                <MenuWrapper ref={menuRef}>
                    <KebabButton
                        type='button'
                        aria-haspopup='true'
                        aria-expanded={isMenuOpen}
                        onClick={handleToggleMenu}
                    >
                        <VisuallyHidden>
                            소셜 계정 연동, 업장 추가 등록
                            등 추가 기능 더보기 버튼
                        </VisuallyHidden>
                        <KebabDots>
                            <span />
                            <span />
                            <span />
                        </KebabDots>
                    </KebabButton>
                    {isMenuOpen && (
                        <MenuContainer role='menu'>
                            <MenuItem
                                type='button'
                                role='menuitem'
                                onClick={handleMenuItemClick(
                                    '소셜 계정 연동'
                                )}
                            >
                                소셜 계정 연동
                            </MenuItem>
                            <MenuItem
                                type='button'
                                role='menuitem'
                                onClick={handleMenuItemClick(
                                    '업장 추가 등록'
                                )}
                            >
                                업장 추가 등록
                            </MenuItem>
                        </MenuContainer>
                    )}
                </MenuWrapper>
            </ProfileHeader>
        </ProfileContainer>
    );
};

export default ManagerProfile;

const ProfileContainer = styled.section`
    background: #ffffff;
    padding: 16px 20px;
`;

const ProfileHeader = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    position: relative;
`;

const ProfileInfoGroup = styled.div`
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
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #999999;
`;

const KebabButton = styled.button`
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 12px;
    background: rgba(17, 17, 17, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
    -webkit-tap-highlight-color: transparent;

    &:hover {
        background: rgba(17, 17, 17, 0.08);
    }

    &:active {
        background: rgba(17, 17, 17, 0.12);
        transform: scale(0.94);
    }

    @media (max-width: 480px) {
        width: 36px;
        height: 36px;
        border-radius: 10px;
    }

    @media (max-width: 360px) {
        width: 32px;
        height: 32px;
        border-radius: 10px;
    }
`;

const KebabDots = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;

    span {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #111111;
    }

    @media (max-width: 480px) {
        gap: 3px;

        span {
            width: 3px;
            height: 3px;
        }
    }
`;

const VisuallyHidden = styled.span`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
`;

const MenuWrapper = styled.div`
    position: relative;
    display: inline-flex;
`;

const MenuContainer = styled.div`
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 160px;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    box-shadow: 0 12px 32px rgba(17, 17, 17, 0.1);
    padding: 6px 0;
    display: flex;
    flex-direction: column;
    z-index: 120;
`;

const MenuItem = styled.button`
    width: 100%;
    background: none;
    border: none;
    padding: 10px 16px;
    text-align: left;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #333333;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;

    &:hover {
        background: rgba(57, 153, 130, 0.08);
        color: #256857;
    }

    &:active {
        background: rgba(57, 153, 130, 0.14);
        color: #174d3b;
    }
`;
