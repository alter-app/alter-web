import styled from 'styled-components';
import WorkplaceEmployeeList from './WorkplaceEmployeeList';
import WorkplaceInfo from './WorkplaceInfo';
import { getWorkplaceDetailInfo } from '../../../services/workplaceService';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WorkplaceSchedule from './WorkplaceSchedule';

interface WorkplaceDetailInfo {
    businessName?: string;
    businessRegistrationNo?: string;
    contact?: string;
    businessType?: string;
    description?: string;
    fullAddress?: string;
    latitude?: number;
    longitude?: number;
    [key: string]: unknown;
}

const WorkplaceDetail = () => {
    const [workplaceDetailInfo, setWorkplaceDetailInfo] =
        useState<WorkplaceDetailInfo>({});
    const { id } = useParams();

    useEffect(() => {
        fetchWorkplaceDetailInfo();
    }, []);

    const fetchWorkplaceDetailInfo = async () => {
        try {
            const result = await getWorkplaceDetailInfo(id || '') as { data?: WorkplaceDetailInfo; [key: string]: unknown };
            setWorkplaceDetailInfo(result.data || {});
            console.log(result.data);
        } catch (error) {
            console.error('업장 정보 조회 오류:', error);
        }
    };

    return (
        <>
            <Container>
                <Title>
                    {workplaceDetailInfo.businessName || '업장 정보'}
                </Title>
                <Contents>
                    <WorkplaceInfo
                        businessRegistrationNo={
                            workplaceDetailInfo.businessRegistrationNo || ''
                        }
                        contact={
                            workplaceDetailInfo.contact || ''
                        }
                        businessType={
                            workplaceDetailInfo.businessType || ''
                        }
                        description={
                            workplaceDetailInfo.description || ''
                        }
                        fullAddress={
                            workplaceDetailInfo.fullAddress || ''
                        }
                        latitude={
                            workplaceDetailInfo.latitude || 0
                        }
                        longitude={
                            workplaceDetailInfo.longitude || 0
                        }
                        businessName={
                            workplaceDetailInfo.businessName || ''
                        }
                    />
                    <WorkplaceEmployeeList id={id} />
                    <WorkplaceSchedule />
                </Contents>
            </Container>
        </>
    );
};

export default WorkplaceDetail;

const Container = styled.div`
    padding: 50px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Title = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 32px;
    line-height: 42px;
`;

const Contents = styled.div`
    display: flex;
    flex-direction: column;
    gap: 50px;
`;
