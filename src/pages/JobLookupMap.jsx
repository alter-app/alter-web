import styled from 'styled-components';
import JobPostDetail from '../components/jobPosts/JobPostDetail';
import JobPostList from '../components/jobPosts/JobPostList';
import NaverMap from '../components/jobPosts/NaverMap';
import { useState, useEffect } from 'react';

const JobLookupMap = () => {
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        // body 스크롤 막기
        document.body.style.overflow = 'hidden';
        return () => {
            // 페이지 나갈 때 복구
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <MapContainer>
            <StyledNaverMap>
                <NaverMap />
            </StyledNaverMap>
            <JobPost>
                <List>
                    <JobPostList
                        onSelect={(post) =>
                            setSelectedId(post.id)
                        }
                    />
                </List>
                {selectedId && (
                    <Detail>
                        <JobPostDetail
                            id={selectedId}
                            onClose={() =>
                                setSelectedId(null)
                            }
                        />
                    </Detail>
                )}
            </JobPost>
        </MapContainer>
    );
};

export default JobLookupMap;

const MapContainer = styled.div`
    position: relative;
    width: 100vw;
    min-height: calc(100dvh - 80px);
    overflow: hidden;
`;

const StyledNaverMap = styled.div`
    position: absolute;
    top: 0;
    left: 390px;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
`;
const JobPost = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    display: flex;
    z-index: 2;
    gap: 12px;
`;

const List = styled.div`
    width: 390px;
    height: 100vh;
    background: #fff;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
    z-index: 3;
`;

const Detail = styled.div`
    height: 100vh;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
    z-index: 3;
    background: transparent;
    padding-top: 10px;
`;
