import styled from 'styled-components';
import { paymentTypeToKorean } from '../../../../utils/paymentUtils';
import { formatNumber } from '../../../../utils/formatNumber';

const JobApplyWorkInfo = ({
    paymentType,
    payAmount,
}) => {
    return (
        <WorkInfoBox>
            <WorkInfoLabel>근무 정보</WorkInfoLabel>
            <WorkPayRow>
                <PayChip>
                    {paymentTypeToKorean(paymentType)}
                </PayChip>
                <WorkPayValue>
                    {formatNumber(payAmount)} 원
                </WorkPayValue>
            </WorkPayRow>
        </WorkInfoBox>
    );
};

export default JobApplyWorkInfo;

const WorkInfoBox = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px 20px;
    box-sizing: border-box;
    background-color: #ffffff;

    @media (max-width: 480px) {
        padding: 16px 16px;
        gap: 14px;
    }

    @media (max-width: 360px) {
        padding: 14px 12px;
        gap: 12px;
    }
`;

const WorkInfoLabel = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    color: #333333;
`;

const PayChip = styled.div`
    width: 41px;
    height: 24px;
    background-color: #2de283;
    border-radius: 12px;
    outline: 1px solid #d9d9d9;
    outline-offset: -1px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f4f4f4;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.18);

    @media (max-width: 480px) {
        width: 38px;
        height: 22px;
        font-size: 13px;
        line-height: 18px;
    }

    @media (max-width: 360px) {
        width: 35px;
        height: 20px;
        font-size: 12px;
        line-height: 16px;
    }
`;

const WorkPayValue = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;

    @media (max-width: 480px) {
        font-size: 15px;
        line-height: 22px;
    }

    @media (max-width: 360px) {
        font-size: 14px;
        line-height: 20px;
    }
`;

const WorkPayRow = styled.div`
    display: flex;
    gap: 8px;

    @media (max-width: 480px) {
        gap: 6px;
    }

    @media (max-width: 360px) {
        gap: 4px;
    }
`;
