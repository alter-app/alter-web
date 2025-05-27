import styled, { css } from 'styled-components';
import dropdown from '../../../assets/icons/dropdown.svg';
import { useState } from 'react';

const WorkLocation = () => {
    const [modal, setModal] = useState(false);

    return (
        <WorkLocationBox>
            <WorkLocationLabel>근무 위치</WorkLocationLabel>
            <WorkLocationRow>
                <WorkLocationAddress>
                    경기 무슨시 무슨구 무슨동 무슨로00번길
                    00 글자수 최대로 여기저기 요리조리
                </WorkLocationAddress>
                <DropdownWrapper>
                    <Dropdown
                        onClick={() => setModal((e) => !e)}
                        open={modal}
                        src={dropdown}
                        alt='주소'
                    />
                    {modal && (
                        <Modal>
                            경기 무슨시 무슨구 무슨동
                            무슨로00번길 00 글자수 최대로
                            여기저기 요리조리
                        </Modal>
                    )}
                </DropdownWrapper>
            </WorkLocationRow>
            <WorkLocationRow>
                <SubwayLineChip>1</SubwayLineChip>
                <SubwayLineChip>수인분당선</SubwayLineChip>
                <SubwayStationText>
                    무슨역 몇번 출구
                </SubwayStationText>
            </WorkLocationRow>
        </WorkLocationBox>
    );
};

export default WorkLocation;

const WorkLocationBox = styled.div`
    width: 390px;
    height: 132px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 18px 20px;
    box-sizing: border-box;
    background-color: #ffffff;
`;

const WorkLocationLabel = styled.div`
    color: #999999;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
`;

const WorkLocationAddress = styled.div`
    width: 324px;
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    overflow: hidden;
    box-sizing: border-box;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const WorkLocationRow = styled.div`
    display: flex;
    gap: 6px;
    align-items: center;
`;

const SubwayLineChip = styled.div`
    display: inline-block;
    padding: 2px 8px;
    background-color: #f1cf69;
    border-radius: 12px;
    color: #f4f4f4;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
`;

const SubwayStationText = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
`;

const DropdownWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const Modal = styled.div`
    width: 350px;
    height: 48px;
    background-color: #ffffff;
    box-sizing: border-box;
    border-radius: 8px;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 12px;
    padding-right: 4px;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #767676;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
    position: absolute;
    top: 100%; /* 드롭다운 바로 아래 */
    right: 0; /* 드롭다운 오른쪽 정렬 */
    margin-top: 4px; /* 약간의 간격 */
    z-index: 10;
`;

const Dropdown = styled.img`
    width: 20px;
    height: 20px;
    display: flex;
    cursor: pointer;
    ${({ open }) =>
        open &&
        css`
            transform: rotate(180deg);
        `}
`;
