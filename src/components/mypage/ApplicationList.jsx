import { useEffect, useState } from 'react';
import ApplicationItem from './ApplicationItem';
import { getApplicationList } from '../../services/myPage';
import styled from 'styled-components';
import Loader from '../Loader';
import dropdown from '../../assets/icons/dropdown.svg';

const ApplicationList = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageInfo, setPageInfo] = useState({
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPage: 1,
    });

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const data = await getApplicationList({
                page: pageInfo.page,
                pageSize: pageInfo.pageSize,
            });
            setApplications(data.data || []);
            setPageInfo((prev) => ({
                ...prev,
                ...data.page,
            }));
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 페이지 변경 시마다 fetchApplications 호출
    useEffect(() => {
        fetchApplications();
    }, [pageInfo.page, pageInfo.pageSize]);

    if (loading)
        return (
            <CenteredDiv>
                <Loader />
            </CenteredDiv>
        );
    if (error)
        return <CenteredDiv>에러: {error}</CenteredDiv>;
    if (applications.length === 0)
        return (
            <CenteredDiv>지원 내역이 없습니다.</CenteredDiv>
        );

    return (
        <Container>
            <ListArea>
                {applications.map((item) => (
                    <ApplicationItem
                        key={item.id}
                        {...item}
                        onCancelSuccess={fetchApplications}
                    />
                ))}
            </ListArea>
            <PaginationArea>
                <Previous
                    disabled={pageInfo.page === 1}
                    onClick={() =>
                        setPageInfo((prev) => ({
                            ...prev,
                            page: prev.page - 1,
                        }))
                    }
                    src={dropdown}
                    alt='이전'
                />
                <PageInfoText>
                    {pageInfo.page} / {pageInfo.totalPage}
                </PageInfoText>
                <Next
                    disabled={
                        pageInfo.page === pageInfo.totalPage
                    }
                    onClick={() =>
                        setPageInfo((prev) => ({
                            ...prev,
                            page: prev.page + 1,
                        }))
                    }
                    src={dropdown}
                    alt='다음'
                />
            </PaginationArea>
        </Container>
    );
};

export default ApplicationList;

// 스타일 컴포넌트 추가
const Container = styled.div`
    width: 390px;
    height: calc(100vh - 80px);
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
`;

const ListArea = styled.div`
    flex: 1;
    overflow-y: auto;
    min-height: 0;
`;

const CenteredDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const PaginationArea = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin: 16px 0;
    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const Next = styled.img`
    width: 20px;
    height: 20px;
    display: flex;
    cursor: pointer;
    transform: rotate(-90deg);
`;

const Previous = styled.img`
    width: 20px;
    height: 20px;
    display: flex;
    cursor: pointer;
    transform: rotate(90deg);
`;

const PageInfoText = styled.span`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
    color: #767676;
`;
