import styled from 'styled-components';
import { formatNumber } from '../../../utils/formatNumber';

const ApplicationCard = ({
    workplaceName,
    status,
    position,
    wage,
    applicationDate,
    onClick,
}) => {
    const getStatusInfo = (status) => {
        // status가 객체인 경우 value와 description 추출
        const statusValue =
            typeof status === 'object'
                ? status.value
                : status;
        const statusDescription =
            typeof status === 'object'
                ? status.description
                : status;

        switch (statusValue) {
            case 'SUBMITTED':
                return {
                    text: statusDescription || '제출됨',
                    color: '#666666',
                };
            case 'SHORTLISTED':
                return {
                    text: statusDescription || '서류 통과',
                    color: '#ffa726',
                };
            case 'ACCEPTED':
                return {
                    text: statusDescription || '수락됨',
                    color: '#2de283',
                };
            case 'REJECTED':
                return {
                    text: statusDescription || '거절됨',
                    color: '#ff4444',
                };
            case 'CANCELLED':
                return {
                    text: statusDescription || '지원 취소',
                    color: '#999999',
                };
            case 'EXPIRED':
                return {
                    text: statusDescription || '기간 만료',
                    color: '#999999',
                };
            case 'DELETED':
                return {
                    text: statusDescription || '삭제됨',
                    color: '#999999',
                };
            default:
                return {
                    text:
                        statusDescription ||
                        statusValue ||
                        status,
                    color: '#666666',
                };
        }
    };

    const statusInfo = getStatusInfo(status);

    return (
        <CardContainer onClick={onClick}>
            <CardContent>
                <CardHeader>
                    <WorkplaceName>
                        {workplaceName}
                    </WorkplaceName>
                    <StatusBadge $color={statusInfo.color}>
                        {statusInfo.text}
                    </StatusBadge>
                </CardHeader>
                <JobInfo>
                    <Position>{position}</Position>
                    <Wage>{formatNumber(wage)}원</Wage>
                </JobInfo>
                <ApplicationDate>
                    {applicationDate}
                </ApplicationDate>
            </CardContent>
            <ArrowIcon />
        </CardContainer>
    );
};

export default ApplicationCard;

const CardContainer = styled.div`
    background: #f8f9fa;
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    border: 1px solid #e9ecef;

    &:hover {
        background: #ffffff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const WorkplaceName = styled.h4`
    font-family: 'Pretendard';
    font-weight: 700;
    font-size: 16px;
    color: #333333;
    margin: 0;
    flex: 1;
`;

const StatusBadge = styled.div`
    padding: 4px 8px;
    border-radius: 12px;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 12px;
    color: #ffffff;
    background: ${(props) => props.$color};
`;

const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const JobInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Position = styled.span`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #666666;
`;

const Wage = styled.span`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    color: #399982;
`;

const ApplicationDate = styled.span`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    color: #999999;
`;

const ArrowIcon = styled.div`
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    background: #cccccc;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z'/%3E%3C/svg%3E")
        no-repeat center;
    mask-size: contain;
`;
