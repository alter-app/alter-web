import styled from 'styled-components';
import JobPostItem from './JobPostItem';

const MarkerJobPostList = ({ posts, onSelect, scrapMap, onScrapChange }) => {
    if (!posts || posts.length === 0) {
        return (
            <EmptyMessage>
                <EmptyIcon>✓</EmptyIcon>
                <EmptyText>공고가 없습니다</EmptyText>
                <EmptySubText>다른 업장을 선택해보세요</EmptySubText>
            </EmptyMessage>
        );
    }

    return (
        <ListArea>
            {posts.map((post) => (
                <JobPostItem
                    key={post.id}
                    {...post}
                    onClick={() => onSelect(post)}
                    checked={scrapMap[post.id] ?? post.scrapped}
                    onScrapChange={(value) => onScrapChange(post.id, value)}
                />
            ))}
        </ListArea>
    );
};

export default MarkerJobPostList;

const ListArea = styled.div`
    padding: 0 20px;
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
`;

const EmptyMessage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #999;
    text-align: center;
`;

const EmptyIcon = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #ccc;
    margin-bottom: 16px;
`;

const EmptyText = styled.div`
    font-family: 'Pretendard';
    font-size: 16px;
    font-weight: 500;
    color: #666;
    margin-bottom: 8px;
`;

const EmptySubText = styled.div`
    font-family: 'Pretendard';
    font-size: 14px;
    font-weight: 400;
    color: #999;
`;
