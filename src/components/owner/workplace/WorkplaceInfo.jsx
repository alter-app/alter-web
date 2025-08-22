import styled from 'styled-components';
import info_icon from '../../../assets/icons/workplace/info_icon.svg';
import RouteButton from './RouteButton';
import NaverMap from '../../owner/NaverMap';

const WorkplaceInfo = ({
    businessRegistrationNo,
    contact,
    businessType,
    description,
    fullAddress,
    latitude,
    longitude,
    businessName,
}) => {
    return (
        <Container>
            <TitleRow>
                <img src={info_icon} alt='업장 정보' />
                <Title>업장 정보</Title>
            </TitleRow>
            <ButtonRow>
                <MapRow>
                    <InfoColumn>
                        <InfoRow>
                            <InfoLabel>
                                사업자 등록번호
                            </InfoLabel>
                            <InfoValue>
                                {businessRegistrationNo}
                            </InfoValue>
                        </InfoRow>
                        <InfoRow>
                            <InfoLabel>연락처</InfoLabel>
                            <InfoValue>{contact}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                            <InfoLabel>업종</InfoLabel>
                            <InfoValue>
                                {businessType}
                            </InfoValue>
                        </InfoRow>
                        <InfoRow>
                            <InfoLabel>설명</InfoLabel>
                            <MultilineValue>
                                {description}
                            </MultilineValue>
                        </InfoRow>
                        <InfoRow>
                            <InfoLabel>주소</InfoLabel>
                            <MultilineValue>
                                {fullAddress}
                            </MultilineValue>
                        </InfoRow>
                    </InfoColumn>
                    <NaverMap
                        latitude={latitude}
                        longitude={longitude}
                        businessName={businessName}
                    />
                </MapRow>

                <ButtonColumn>
                    <RouteButton
                        text='공고 작성 하기'
                        path='/posting'
                    />
                    <RouteButton
                        text='지원자 목록 보기'
                        path='/applicant'
                    />
                    <RouteButton
                        text='업장 정보 수정'
                        path='/'
                    />
                </ButtonColumn>
            </ButtonRow>
        </Container>
    );
};

export default WorkplaceInfo;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Title = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 24px;
    line-height: 28px;
`;

const TitleRow = styled.div`
    display: flex;
    gap: 5px;
`;

const InfoLabel = styled.div`
    color: #111111;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 18px;
    line-height: 20px;
    width: 150px;
`;

const InfoValue = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 18px;
    line-height: 20px;
    width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const InfoRow = styled.div`
    display: flex;
    gap: 10px;
`;

const InfoColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const MapRow = styled.div`
    display: flex;
    box-sizing: border-box;
    width: 100%;
    gap: 50px;
    padding: 30px;
    background-color: #ffffff;
    border-radius: 20px;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.25);
`;

const ButtonRow = styled.div`
    width: 100%;
    display: flex;
    gap: 30px;
`;

const ButtonColumn = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const MultilineValue = styled.div`
    color: #767676;
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 18px;
    line-height: 20px;
    width: 300px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
    text-overflow: ellipsis;
`;
