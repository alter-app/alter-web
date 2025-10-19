import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import ConfirmModal from '../../../shared/ConfirmModal';
import { useNavigate } from 'react-router-dom';

const EmployeeCard = ({ employee, workplaceId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    console.log('EmployeeCard 렌더링:', employee);

    const handleMenuClick = (e) => {
        e.stopPropagation();
        console.log('메뉴 클릭:', employee.user.name);
        setIsMenuOpen(!isMenuOpen);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleRequestReputation = () => {
        navigate('/reputation-write', {
            state: {
                employeeId: employee.user.id,
                employeeName: employee.user.name,
                workplaceId: workplaceId,
                type: 'worker',
            },
        });
        setIsModalOpen(false);
    };

    const handleMenuOptionClick = (option) => {
        setIsMenuOpen(false);
        switch (option) {
            case 'reputation':
                setIsModalOpen(true);
                break;
            case 'changeWork':
                console.log(
                    '근무 바꾸기 클릭:',
                    employee.user.name
                );
                // TODO: 근무 바꾸기 기능 구현
                break;
            case 'report':
                console.log(
                    '신고 클릭:',
                    employee.user.name
                );
                // TODO: 신고 기능 구현
                break;
            default:
                break;
        }
    };

    // 메뉴 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener(
                'mousedown',
                handleClickOutside
            );
        }

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };
    }, [isMenuOpen]);

    return (
        <>
            <Card>
                <CardLeft>
                    <Avatar>
                        {employee.position?.emoji || '👤'}
                    </Avatar>
                    <EmployeeInfo>
                        <NameRow>
                            <Name>
                                {employee.user.name}
                            </Name>
                            <PositionTag>
                                {employee.position
                                    ?.description || '직원'}
                            </PositionTag>
                        </NameRow>
                        <StartTime>
                            {employee.startTime}
                        </StartTime>
                    </EmployeeInfo>
                </CardLeft>

                <CardRight>
                    <MenuContainer ref={menuRef}>
                        <MenuButton
                            onClick={handleMenuClick}
                        >
                            <svg
                                width='16'
                                height='16'
                                viewBox='0 0 24 24'
                                fill='none'
                            >
                                <circle
                                    cx='12'
                                    cy='5'
                                    r='2'
                                    fill='#666666'
                                />
                                <circle
                                    cx='12'
                                    cy='12'
                                    r='2'
                                    fill='#666666'
                                />
                                <circle
                                    cx='12'
                                    cy='19'
                                    r='2'
                                    fill='#666666'
                                />
                            </svg>
                        </MenuButton>

                        {isMenuOpen && (
                            <DropdownMenu>
                                <MenuItem
                                    onClick={() =>
                                        handleMenuOptionClick(
                                            'reputation'
                                        )
                                    }
                                >
                                    <MenuItemIcon>
                                        ⭐
                                    </MenuItemIcon>
                                    <MenuItemText>
                                        평판 요청
                                    </MenuItemText>
                                </MenuItem>
                                <MenuItem
                                    onClick={() =>
                                        handleMenuOptionClick(
                                            'changeWork'
                                        )
                                    }
                                >
                                    <MenuItemIcon>
                                        🔄
                                    </MenuItemIcon>
                                    <MenuItemText>
                                        근무 바꾸기
                                    </MenuItemText>
                                </MenuItem>
                                <MenuItem
                                    onClick={() =>
                                        handleMenuOptionClick(
                                            'report'
                                        )
                                    }
                                >
                                    <MenuItemIcon>
                                        🚨
                                    </MenuItemIcon>
                                    <MenuItemText>
                                        신고
                                    </MenuItemText>
                                </MenuItem>
                            </DropdownMenu>
                        )}
                    </MenuContainer>
                </CardRight>
            </Card>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleRequestReputation}
                title='평판 요청'
                message={`${employee.user.name}님에 대한 평판을 작성하시겠습니까?`}
                confirmText='평판 작성하기'
                cancelText='취소'
                confirmColor='#2de283'
            />
        </>
    );
};

export default EmployeeCard;

const Card = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
`;

const CardLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
`;

const Avatar = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    border: 2px solid #e9ecef;
`;

const EmployeeInfo = styled.div`
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

const Name = styled.span`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    color: #333333;
`;

const PositionTag = styled.div`
    padding: 2px 8px;
    background: #fff3e0;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 12px;
    color: #e65100;
`;

const Rating = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #333333;
`;

const StarIcon = styled.span`
    color: #ffc107;
    font-size: 14px;
`;

const StartTime = styled.span`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    color: #999999;
`;

const CardRight = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const StatusTag = styled.div`
    padding: 4px 8px;
    background: #e8f5e8;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 12px;
    color: #2e7d32;
`;

const MenuContainer = styled.div`
    position: relative;
`;

const MenuButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 6px;

    &:hover {
        background: #f5f5f5;
    }
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 4px;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    min-width: 140px;
    overflow: hidden;
`;

const MenuItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: #f8f9fa;
    }

    &:active {
        background: #e9ecef;
    }
`;

const MenuItemIcon = styled.span`
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
`;

const MenuItemText = styled.span`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #333333;
`;
