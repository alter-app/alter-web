import styled from 'styled-components';
import ApplicantItem from './ApplicantItem';
import { useState, useEffect } from 'react';
import { getApplicants } from '../../../services/mainPageService';
import { useNavigate } from 'react-router-dom';

const ApplicantList = () => {
    const [applicants, setApplicants] = useState([]);
    const navigate = useNavigate();
    const goToApplicantList = () => navigate('/applicant');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await getApplicants(3, 'SUBMITTED');
            setApplicants(result.data);
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
                    {applicants.slice(0, 3).map((item) => (
                        <ApplicantItem key={item.id} {...item} />
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
