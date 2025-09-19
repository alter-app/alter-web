import styled from 'styled-components';

const WorkLocation = ({ workspace }) => {
    return (
        <WorkLocationBox>
            <WorkLocationLabel>근무 위치</WorkLocationLabel>
            <WorkLocationAddress>
                {workspace?.fullAddress ||
                    '주소 정보가 없습니다.'}
            </WorkLocationAddress>
        </WorkLocationBox>
    );
};

export default WorkLocation;

const WorkLocationBox = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
    box-sizing: border-box;
    background-color: #ffffff;

    @media (max-width: 480px) {
        padding: 16px;
        gap: 14px;
    }

    @media (max-width: 360px) {
        padding: 14px 12px;
        gap: 12px;
    }
`;

const WorkLocationLabel = styled.div`
    color: #999999;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;

    @media (max-width: 480px) {
        font-size: 13px;
        line-height: 18px;
    }

    @media (max-width: 360px) {
        font-size: 12px;
        line-height: 16px;
    }
`;

const WorkLocationAddress = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    word-wrap: break-word;
    white-space: normal;

    @media (max-width: 480px) {
        font-size: 13px;
        line-height: 18px;
    }

    @media (max-width: 360px) {
        font-size: 12px;
        line-height: 16px;
    }
`;
