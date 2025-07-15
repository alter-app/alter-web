import styled from 'styled-components';
import { formatNumber } from '../../../utils/formatNumber';
import { useState } from 'react';
import { calculateHourlyWage } from '../../../utils/paymentUtils';

const minimumWage = formatNumber(10030);

const payTypes = [
    { label: '시급', value: 'HOURLY' },
    { label: '일급', value: 'DAILY' },
    { label: '주급', value: 'WEEKLY' },
    { label: '월급', value: 'MONTHLY' },
];

const WageInputField = ({
    name,
    value,
    onChange,
    payType,
    onPayTypeChange,
}) => {
    const [workHour, setWorkHour] = useState('');

    return (
        <WageContainer>
            <TitleRow>
                <WageTitle>급여</WageTitle>
                <TitleInfo>
                    급여는 시급으로 자동 변환 됩니다.
                </TitleInfo>
            </TitleRow>
            <WageRow>
                <WageColumn>
                    <RadioGroup>
                        {payTypes.map((type) => (
                            <RadioLabel key={type.value}>
                                <RadioInput
                                    type='radio'
                                    name='payType'
                                    value={type.value}
                                    checked={
                                        payType ===
                                        type.value
                                    }
                                    onChange={() =>
                                        onPayTypeChange(
                                            type.value
                                        )
                                    }
                                />
                                <RadioText
                                    checked={
                                        payType ===
                                        type.value
                                    }
                                >
                                    {type.label}
                                </RadioText>
                            </RadioLabel>
                        ))}
                    </RadioGroup>
                    <InputRow>
                        <WageInput
                            name={name}
                            value={
                                value
                                    ? formatNumber(
                                          Number(value)
                                      )
                                    : ''
                            }
                            onChange={onChange}
                            placeholder='금액 직접 입력'
                        />
                        <Measure>원</Measure>
                    </InputRow>
                    <WageInfo>
                        최저임금 {minimumWage}원 기준
                    </WageInfo>
                    <InputRow>
                        <TimeInput
                            name='workHour'
                            value={workHour}
                            onChange={(e) =>
                                setWorkHour(
                                    e.target.value.replace(
                                        /\D/g,
                                        ''
                                    )
                                )
                            }
                            placeholder='휴게시간 제외한 근무시간을 기입해 주세요.'
                        />
                        <Measure>시간</Measure>
                    </InputRow>
                </WageColumn>
                <Divider />
                <WageColumn>
                    <PayInfoNotice>
                        2025년 기준 최저시급은 {minimumWage}
                        원 입니다. 근로시간 6시간 이상시
                        1시간잉상의 휴게시간ㅍ부과되어야
                        합니다잉 관련법률 어쩌구
                    </PayInfoNotice>
                    <CalculatedPayContainer>
                        <CalculatedPayBox>
                            <CalculatedPayLabel>
                                책정시급
                            </CalculatedPayLabel>
                            <CalculatedPayValue>
                                {formatNumber(
                                    calculateHourlyWage(
                                        payType,
                                        value,
                                        workHour
                                    )
                                )}
                            </CalculatedPayValue>
                            <Measure>원</Measure>
                        </CalculatedPayBox>
                    </CalculatedPayContainer>
                </WageColumn>
            </WageRow>
        </WageContainer>
    );
};

export default WageInputField;

const WageContainer = styled.div`
    width: 820px;
    height: 333px;
    background-color: #ffffff;
    border-radius: 4px;
    padding: 20px;
    box-sizing: border-box;
`;

const WageTitle = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: #111111;
`;

const TitleInfo = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #999999;
`;

const TitleRow = styled.div`
    display: flex;
    gap: 16px;
    align-items: center;
    margin-bottom: 40px;
`;

const RadioGroup = styled.div`
    display: flex;
    gap: 32px;
    align-items: center;
    margin-bottom: 16px;
`;

const RadioLabel = styled.label`
    display: flex;
    cursor: pointer;
    gap: 8px;
`;

const RadioInput = styled.input.attrs({ type: 'radio' })`
    accent-color: #2de283;
    margin: 0px;
`;

const RadioText = styled.span`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #767676;
`;

const WageInput = styled.input`
    width: 345px;
    height: 48px;
    padding: 13px 16px;
    box-sizing: border-box;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;
    outline: none;
    border: 1px solid transparent;
    border-radius: 8px;
    border-color: #f6f6f6;
    background-color: #f6f6f6;

    &::placeholder {
        color: #999999;
    }

    &:focus {
        outline: none;
        border: 1px solid #2de283;
    }
`;

const TimeInput = styled.input`
    width: 323px;
    height: 48px;
    padding: 13px 16px;
    box-sizing: border-box;
    border-radius: 8px;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;
    outline: none;
    border: 1px solid transparent;
    border-radius: 8px;
    border-color: #f6f6f6;
    background-color: #f6f6f6;

    &::placeholder {
        color: #999999;
    }

    &:focus {
        outline: none;
        border: 1px solid #2de283;
    }
`;

const Measure = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;
    color: #111111;
`;

const InputRow = styled.div`
    width: 364px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const WageInfo = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #dc0000;
    padding-left: 4px;
    margin-bottom: 27px;
`;

const Divider = styled.div`
    width: 1px;
    height: 200px;
    background: #d9d9d9;
`;

const PayInfoNotice = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #999999;
    width: 286px;
    margin-bottom: 60px;
`;

const WageRow = styled.div`
    display: flex;
    gap: 30px;
`;

const WageColumn = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const CalculatedPayContainer = styled.div`
    display: flex;
    width: 318px;
    justify-content: end;
`;

const CalculatedPayBox = styled.div`
    display: flex;
    gap: 16px;
    border-bottom: solid 1px rgba(153, 153, 153, 0.2);
    justify-content: end;
    align-items: end;
`;

const CalculatedPayValue = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 24px;
    line-height: 34px;
    color: #111111;
`;

const CalculatedPayLabel = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;
    color: #767676;
`;
