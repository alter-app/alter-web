import styled from 'styled-components';
import ApplicantItem from './ApplicantItem';
import { useState, useEffect } from 'react';
import { getApplicants } from '../../../services/mainPageService';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Arrow from '../../../assets/icons/Arrow.svg';

const ApplicantList = () => {
    const [applicants, setApplicants] = useState([]);
    const scrollRef = useRef();
    const navigate = useNavigate();
    const goToApplicantList = () => navigate('/applicant');

    // 버튼 클릭시 스크롤 이동
    const slideLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: -400,
                behavior: 'smooth',
            });
        }
    };
    const slideRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: 400,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await getApplicants();
            setApplicants(result.data);
            console.log(result.data);
        } catch (error) {
            console.error('지원자 목록 조회 오류:', error);
        }
    };

    return (
        <>
            <Column>
                <TopBetween>
                    <TopLeftRow>
                        <ApplicantTitle>
                            지원자 목록
                        </ApplicantTitle>
                        <ViewAllButton
                            onClick={goToApplicantList}
                        >
                            전체보기
                        </ViewAllButton>
                    </TopLeftRow>
                    <TopRightRow>
                        <ArrowLeftIcon
                            src={Arrow}
                            alt='왼쪽 버튼'
                            onClick={slideLeft}
                        />
                        <ArrowRightIcon
                            src={Arrow}
                            alt='오른쪽 버튼'
                            onClick={slideRight}
                        />
                    </TopRightRow>
                </TopBetween>
                <ContentRow>
                    <AccentBar />
                    {applicants.length > 0 ? (
                        <ScrollableRow ref={scrollRef}>
                            {applicants.map((item) => (
                                <ApplicantItem
                                    key={item.id}
                                    {...item}
                                />
                            ))}
                        </ScrollableRow>
                    ) : (
                        <EmptyNotification>
                            지원자가 없습니다.
                        </EmptyNotification>
                    )}
                </ContentRow>
            </Column>
        </>
    );
};

export default ApplicantList;

const ApplicantTitle = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 32px;
    line-height: 42px;
`;

const ViewAllButton = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 18px;
    line-height: 24px;
    display: flex;
    align-items: center;
    cursor: pointer;
    text-decoration: underline;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const TopBetween = styled.div`
    display: flex;
    justify-content: space-between;
`;

const TopLeftRow = styled.div`
    display: flex;
    gap: 20px;
`;

const TopRightRow = styled.div`
    display: flex;
    gap: 15px;
    padding-right: 20px;
    align-items: center;
`;

const ContentRow = styled.div`
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    gap: 10px;
`;

const AccentBar = styled.div`
    width: 5px;
    height: 30px;
    background: #2de283;
`;

const ScrollableRow = styled.div`
    display: flex;
    gap: 20px;
    overflow-x: auto;
    padding-bottom: 10px;
    width: 100%;
    min-width: 0;
    padding-left: 10px;
    padding-right: 20px;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
        display: none;
    }
`;

const ArrowRightIcon = styled.img`
    width: 35px;
    height: 35px;
    cursor: pointer;
`;

const ArrowLeftIcon = styled.img`
    width: 35px;
    height: 35px;
    transform: scaleX(-1);
    cursor: pointer;
`;

const EmptyNotification = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 20px;
    line-height: 30px;
`;
