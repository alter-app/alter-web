import styled from 'styled-components';

const EmployeeCard = ({ employee }) => {
    console.log('EmployeeCard 렌더링:', employee);

    const handleMenuClick = () => {
        console.log('메뉴 클릭:', employee.name);
    };

    return (
        <Card>
            <CardLeft>
                <Avatar>
                    {employee.position?.emoji || '👤'}
                </Avatar>
                <EmployeeInfo>
                    <NameRow>
                        <Name>{employee.name}</Name>
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
                <MenuButton onClick={handleMenuClick}>
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
            </CardRight>
        </Card>
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
