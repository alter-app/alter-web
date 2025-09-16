import styled, { css } from 'styled-components';
import dropdown from '../../../../assets/icons/dropdown.svg';
import { useState } from 'react';

const WorkLocation = ({ workspace }) => {
    const [modal, setModal] = useState(false);

    return (
        <WorkLocationBox>
            <WorkLocationLabel>근무 위치</WorkLocationLabel>
            <WorkLocationRow>
                <WorkLocationAddress>
                    {workspace?.fullAddress ||
                        '주소 정보가 없습니다.'}
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
                            {workspace?.fullAddress ||
                                '주소 정보가 없습니다.'}
                        </Modal>
                    )}
                </DropdownWrapper>
            </WorkLocationRow>
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
    flex: 1;
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    overflow: hidden;
    box-sizing: border-box;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media (max-width: 480px) {
        font-size: 13px;
        line-height: 18px;
    }

    @media (max-width: 360px) {
        font-size: 12px;
        line-height: 16px;
    }
`;

const WorkLocationRow = styled.div`
    display: flex;
    gap: 6px;
    align-items: center;

    @media (max-width: 480px) {
        gap: 4px;
    }

    @media (max-width: 360px) {
        gap: 3px;
    }
`;

const SubwayLineChip = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 10px;
    background-color: #f1cf69;
    border-radius: 16px;
    color: #ffffff;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 12px;
    line-height: 1.2;
    margin-right: 6px;
    margin-bottom: 4px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 480px) {
        padding: 3px 8px;
        font-size: 11px;
        border-radius: 14px;
        margin-right: 4px;
        margin-bottom: 3px;
    }

    @media (max-width: 360px) {
        padding: 2px 6px;
        font-size: 10px;
        border-radius: 12px;
        margin-right: 3px;
        margin-bottom: 2px;
    }

    @media (max-width: 320px) {
        padding: 2px 5px;
        font-size: 9px;
        border-radius: 10px;
    }
`;

const SubwayStationText = styled.div`
    color: #666666;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    line-height: 1.4;
    margin-bottom: 4px;

    @media (max-width: 480px) {
        font-size: 13px;
        margin-bottom: 3px;
    }

    @media (max-width: 360px) {
        font-size: 12px;
        margin-bottom: 2px;
    }

    @media (max-width: 320px) {
        font-size: 11px;
    }
`;

const DropdownWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const Modal = styled.div`
    min-width: 280px;
    max-width: calc(100vw - 40px);
    min-height: 48px;
    background-color: #ffffff;
    box-sizing: border-box;
    border-radius: 12px;
    padding: 12px 16px;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #333333;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
    border: 1px solid #f0f0f0;
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 1000;
    word-wrap: break-word;
    white-space: normal;
    display: flex;
    align-items: center;

    @media (max-width: 480px) {
        min-width: 240px;
        max-width: calc(100vw - 32px);
        min-height: 44px;
        font-size: 13px;
        line-height: 18px;
        padding: 10px 14px;
        border-radius: 10px;
        top: calc(100% + 6px);
    }

    @media (max-width: 360px) {
        min-width: 200px;
        max-width: calc(100vw - 24px);
        min-height: 40px;
        font-size: 12px;
        line-height: 16px;
        padding: 8px 12px;
        border-radius: 8px;
        top: calc(100% + 4px);
    }

    @media (max-width: 320px) {
        min-width: 180px;
        max-width: calc(100vw - 16px);
        right: -10px;
    }
`;

const Dropdown = styled.img`
    width: 20px;
    height: 20px;
    display: flex;
    cursor: pointer;
    transition: transform 0.2s ease;
    padding: 4px;
    border-radius: 4px;

    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }

    &:active {
        background-color: rgba(0, 0, 0, 0.1);
    }

    ${({ open }) =>
        open &&
        css`
            transform: rotate(180deg);
        `}

    @media (max-width: 480px) {
        width: 18px;
        height: 18px;
        padding: 3px;
    }

    @media (max-width: 360px) {
        width: 16px;
        height: 16px;
        padding: 2px;
    }

    @media (max-width: 320px) {
        width: 14px;
        height: 14px;
        padding: 2px;
    }
`;
