import WorkplaceItem from './WorkplaceItem';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { getWorkplaceList } from '../../../services/mainPageService';

const WorkplaceList = () => {
    const [workplaceData, setWorkplaceData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await getWorkplaceList();
            setWorkplaceData(result.data);
            console.log(result.data);
        } catch (error) {
            console.error('업장 목록 조회 오류:', error);
        }
    };

    return (
        <SectionContainer>
            <SectionHeader>
                <SectionTitle>업장 목록</SectionTitle>
            </SectionHeader>
            {workplaceData.length > 0 ? (
                <CardList>
                    {workplaceData.map((item) => (
                        <WorkplaceItem
                            key={item.id}
                            {...item}
                        />
                    ))}
                </CardList>
            ) : (
                <EmptyMessage>
                    등록된 업장이 없습니다.
                </EmptyMessage>
            )}
        </SectionContainer>
    );
};

export default WorkplaceList;

const SectionContainer = styled.div`
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    border: 1px solid #e9ecef;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

const SectionTitle = styled.h3`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 18px;
    color: #333333;
    margin: 0;
`;

const CardList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const EmptyMessage = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    text-align: center;
    padding: 20px 0;
`;
