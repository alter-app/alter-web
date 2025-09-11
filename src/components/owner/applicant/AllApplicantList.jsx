import styled from 'styled-components';
import { getPostingsApplications } from '../../../services/managerPage';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../../Loader';
import AllApplicationsItem from './AllApplicantItem';
import { getWorkplaceList } from '../../../services/mainPageService';
import Dropdown from '../../Dropdown';

const AllApplicantList = () => {
    const [postingsApplications, setPostingsApplications] =
        useState([]);
    const [workplaceInfo, setWorkplaceInfo] = useState([]);
    const [checkedWorkplaceId, setCheckedWorkplaceId] =
        useState('');
    const [checkedStatusId, setCheckedStatusId] =
        useState('');

    const [cursorInfo, setCursorInfo] = useState('');
    const [totalCount, setTotalCount] = useState(0);

    const applicantStatuses = [
        { id: 'ALL', label: '모든 지원 상태' },
        { id: 'SUBMITTED', label: '제출됨' },
        { id: 'SHORTLISTED', label: '서류 통과' },
        { id: 'ACCEPTED', label: '수락됨' },
        { id: 'REJECTED', label: '거절됨' },
        { id: 'CANCELLED', label: '지원 취소' },
        { id: 'EXPIRED', label: '기간 만료' },
        { id: 'DELETED', label: '삭제됨' },
    ];

    // 업장 목록 조회
    useEffect(() => {
        fetchWorkplaceList();
    }, []);

    const fetchWorkplaceList = async () => {
        try {
            const result = await getWorkplaceList();
            setWorkplaceInfo([
                {
                    id: '',
                    businessName: '모든 업장',
                },
                ...result.data,
            ]);
            console.log(result.data);
        } catch (error) {
            console.error('업장 목록 조회 오류:', error);
        }
    };

    // 업장 또는 상태가 바뀔 때 데이터 가져오기
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const statusFilter =
                    checkedStatusId === 'ALL'
                        ? ''
                        : checkedStatusId;
                const result =
                    await getPostingsApplications({
                        cursorInfo: '',
                        checkedWorkplaceId,
                        checkedStatusId: statusFilter,
                    });

                setPostingsApplications(result.data);
                setCursorInfo(result.page.cursor);
                setTotalCount(result.page.totalCount);
                console.log(result.data);
            } catch (error) {
                console.error(
                    '공고 지원 목록 조회 오류:',
                    error
                );
            }
        };

        fetchInitialData();
    }, [checkedWorkplaceId, checkedStatusId]);

    // 스크롤에 의해 추가 데이터 가져오기
    const fetchData = async () => {
        try {
            const result = await getPostingsApplications({
                cursorInfo,
                checkedWorkplaceId,
                checkedStatusId,
            });
            console.log(result.data);

            setPostingsApplications((prev) => [
                ...prev,
                ...result.data,
            ]);
            setCursorInfo(result.page.cursor);
            setTotalCount(result.page.totalCount);
        } catch (error) {
            console.error(
                '공고 지원 목록 조회 오류:',
                error
            );
        }
    };

    // 업장 옵션 선택 핸들러
    const handleWorkplaceChange = (selectedId) => {
        setCheckedWorkplaceId(selectedId);
    };

    // 상태 옵션 선택 핸들러
    const handleStatusChange = (selectedId) => {
        setCheckedStatusId(selectedId);
    };

    return (
        <Container>
            <TopRow>
                <TotalCountInfo>
                    총 <TotalCount>{totalCount}</TotalCount>{' '}
                    건
                </TotalCountInfo>
                <OptionsRow>
                    <Dropdown
                        options={workplaceInfo.map(
                            (item) => ({
                                id: item.id,
                                name: item.businessName,
                            })
                        )}
                        onChange={handleWorkplaceChange}
                        width={200}
                    />
                    <Dropdown
                        options={applicantStatuses.map(
                            (item) => ({
                                id: item.id,
                                name: item.label,
                            })
                        )}
                        onChange={handleStatusChange}
                        width={200}
                    />
                </OptionsRow>
            </TopRow>

            <ListArea id='scrollableListArea'>
                {postingsApplications.length === 0 ? (
                    <EmptyMessage>
                        지원자가 없습니다.
                    </EmptyMessage>
                ) : (
                    <InfiniteScroll
                        dataLength={
                            postingsApplications.length
                        }
                        next={() => fetchData()}
                        hasMore={
                            postingsApplications.length <
                            totalCount
                        }
                        loader={
                            <CenteredDiv>
                                <Loader />
                            </CenteredDiv>
                        }
                        scrollableTarget='scrollableListArea'
                    >
                        {postingsApplications.map(
                            (post, index) => (
                                <div key={post.id}>
                                    <AllApplicationsItem
                                        id={post.id}
                                        createdAt={
                                            post.createdAt
                                        }
                                        workspaceName={
                                            post.workspace
                                                .name
                                        }
                                        status={post.status}
                                        schedule={
                                            post.schedule
                                        }
                                        applicant={
                                            post.applicant
                                        }
                                    />
                                    {index !==
                                        postingsApplications.length -
                                            1 && (
                                        <Separator />
                                    )}
                                </div>
                            )
                        )}
                    </InfiniteScroll>
                )}
            </ListArea>
        </Container>
    );
};

export default AllApplicantList;

const Container = styled.div`
    width: 70vw;
    background-color: #ffffff;
    display: flex;
    border-radius: 8px;
    flex-direction: column;
`;

const ListArea = styled.div`
    flex: 1;
    overflow-y: auto;
    min-height: 0; /* flexbox에서 overflow 작동 위해 필요 */
`;

const CenteredDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const OptionsRow = styled.div`
    display: flex;
    gap: 10px;
`;

const TopRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    border-bottom: 1px solid #d0d0d0;
`;

const TotalCountInfo = styled.div`
    display: flex;
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
`;

const TotalCount = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    margin: 0 5px;
`;

const EmptyMessage = styled.div`
    display: flex;
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    padding: 20px 20px;
    align-items: center;
    justify-content: center;
`;

const Separator = styled.div`
    height: 1px;
    background-color: #d0d0d0;
    margin: 0 20px;
`;
