import styled from 'styled-components';
import ApplicantItem from './ApplicantItem';
import { useState, useEffect } from 'react';
import { getApplicants } from '../../../services/mainPageService';
import { useNavigate } from 'react-router-dom';

interface Applicant {
    id: string | number;
    workspace?: {
        name?: string;
        [key: string]: unknown;
    };
    status?: {
        description?: string;
        [key: string]: unknown;
    };
    createdAt?: string;
    schedule?: {
        startTime: string;
        endTime: string;
        workingDays?: string[];
        [key: string]: unknown;
    };
    applicant?: {
        name?: string;
        reputationSummary?: {
            topKeywords?: Array<{
                id?: string | number;
                emoji?: string;
                description?: string;
                [key: string]: unknown;
            }>;
            [key: string]: unknown;
        };
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

const ApplicantList = () => {
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const navigate = useNavigate();
    const goToApplicantList = () => navigate('/applicant');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await getApplicants(3, 'SUBMITTED') as { data: Applicant[] };
            setApplicants(result.data || []);
            console.log(result.data);
        } catch (error) {
            console.error('지원자 목록 조회 오류:', error);
        }
    };

    return (
        <SectionContainer>
            <SectionHeader>
                <SectionTitle>지원자 목록</SectionTitle>
                <ViewAllButton onClick={goToApplicantList}>
                    전체보기
                </ViewAllButton>
            </SectionHeader>
            {applicants.length > 0 ? (
                <CardList>
                    {applicants.slice(0, 3).map((item: Applicant) => (
                        <ApplicantItem 
                            key={item.id} 
                            workspace={item.workspace || { name: '알 수 없는 업장' }}
                            status={item.status || { description: '알 수 없음' }}
                            createdAt={item.createdAt}
                            schedule={item.schedule || { startTime: '', endTime: '', workingDays: [] }}
                            applicant={item.applicant || { name: '알 수 없는 지원자' }}
                        />
                    ))}
                </CardList>
            ) : (
                <EmptyMessage>지원자가 없습니다.</EmptyMessage>
            )}
        </SectionContainer>
    );
};

export default ApplicantList;

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

const ViewAllButton = styled.button`
    background: none;
    border: none;
    color: #666666;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
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
