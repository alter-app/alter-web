import styled from 'styled-components';
import CertificateItem from './CertificateItem';
import { useEffect, useState } from 'react';
import {
    getCertificates,
    deleteCertificates,
    addCertificates,
    eidtCertificates,
    getCertificateDetail,
} from '../../services/myPage';
import { formatDateInput } from '../../utils/weekUtil';
import CertificateInputForm from './CertificateInputForm';
import Loader from '../Loader';

const CertificateList = () => {
    const [certificates, setCertificates] = useState([]);
    const [addStatus, setAddStatus] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [detailLoading, setDetailLoading] =
        useState(false);

    // 수정할 자격 정보
    const [editCertificate, setEditCertificate] = useState({
        certificateName: '',
        certificateId: '',
        publisherName: '',
        issuedAt: '',
        expiresAt: '',
    });

    // 추가할 자격 정보
    const [addCertificate, setAddCertificate] = useState({
        certificateName: '',
        certificateId: '',
        publisherName: '',
        issuedAt: '',
        expiresAt: '',
    });

    // 자격 정보 목록 조회 요청
    useEffect(() => {
        const fetchCertificates = async () => {
            const result = await getCertificates();
            setCertificates(result.data);
        };
        fetchCertificates();
        console.log(certificates);
    }, []);

    // 자격 삭제 처리 함수
    const handleDelete = async (id) => {
        try {
            await deleteCertificates({ certificateId: id });
            setCertificates((prev) =>
                prev.filter((cert) => cert.id !== id)
            );
        } catch (e) {
            console.log('삭제에 실패했습니다.');
        }
    };

    // 모든 추가할 자격 정보 하나의 onChange로 처리
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        if (name === 'issuedAt' || name === 'expiresAt') {
            newValue = formatDateInput(value);
        }
        setAddCertificate((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    // 자격 추가 버튼 핸들러
    const handleToggleAdd = () => {
        setAddStatus((prev) => !prev);
        // 닫기로 바꿀 때 입력값 초기화
        if (addStatus) {
            setAddCertificate({
                certificateName: '',
                certificateId: '',
                publisherName: '',
                issuedAt: '',
                expiresAt: '',
            });
        }
    };

    // 자격증 등록 처리
    const handleAddCertificate = async () => {
        try {
            await addCertificates(addCertificate);
            // 등록 성공 후 전체 리스트 다시 불러오기
            const result = await getCertificates();
            setCertificates(result.data);
            setAddCertificate({
                certificateName: '',
                certificateId: '',
                publisherName: '',
                issuedAt: '',
                expiresAt: '',
            });
            setAddStatus(false);
        } catch (e) {
            console.log('등록에 실패했습니다.');
        }
    };

    // 수정 버튼 클릭 핸들러 (기존 내용 가져옴, 상세 요청)
    const handleToggleEdit = async (cert) => {
        if (editingId === cert.id) {
            setEditingId(null);
        } else {
            setEditingId(cert.id);
            setDetailLoading(true);
            try {
                const detail = await getCertificateDetail(
                    cert.id
                );
                setEditCertificate({
                    certificateName:
                        detail.data.certificateName,
                    certificateId:
                        detail.data.certificateId,
                    publisherName:
                        detail.data.publisherName,
                    issuedAt: detail.data.issuedAt,
                    expiresAt: detail.data.expiresAt,
                });
            } catch (e) {
                setEditCertificate({
                    certificateName: cert.certificateName,
                    certificateId: cert.certificateId,
                    publisherName: cert.publisherName,
                    issuedAt: cert.issuedAt,
                    expiresAt: cert.expiresAt,
                });
            }
            setDetailLoading(false);
        }
    };

    // 수정 폼 입력 핸들러
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        if (name === 'issuedAt' || name === 'expiresAt') {
            newValue = formatDateInput(value);
        }
        setEditCertificate((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    // 수정한 거 저장하는 핸들러
    const handleEditSave = async () => {
        try {
            await eidtCertificates(
                editCertificate,
                editingId
            );
            const result = await getCertificates();
            setCertificates(result.data);
            setEditingId(null);
        } catch (e) {
            console.log('수정에 실패했습니다.');
        }
    };

    return (
        <Container>
            <TopRow>
                <Title>자격증</Title>
                <AddButton onClick={handleToggleAdd}>
                    {addStatus ? '닫기' : '추가'}
                </AddButton>
            </TopRow>
            {addStatus && (
                <InputsGap>
                    <Divider />
                    <CertificateInputForm
                        value={addCertificate}
                        onChange={handleInputChange}
                    />
                    <StyledButton
                        onClick={handleAddCertificate}
                    >
                        등록
                    </StyledButton>
                    <Divider />
                </InputsGap>
            )}

            {certificates.map((cert) => (
                <div key={cert.id}>
                    <CertificateItem
                        {...cert}
                        isOpen={editingId === cert.id}
                        onToggle={() =>
                            handleToggleEdit(cert)
                        }
                    />
                    {editingId === cert.id && (
                        <InputsGap>
                            {detailLoading ? (
                                <LoaderContainer>
                                    <Loader />
                                </LoaderContainer>
                            ) : (
                                <CertificateInputForm
                                    value={editCertificate}
                                    onChange={
                                        handleEditInputChange
                                    }
                                />
                            )}
                            <EditRow>
                                <EditButton
                                    onClick={handleEditSave}
                                >
                                    수정
                                </EditButton>
                                <DelteButton
                                    onClick={() =>
                                        handleDelete(
                                            cert.id
                                        )
                                    }
                                >
                                    삭제
                                </DelteButton>
                            </EditRow>
                            <Divider />
                        </InputsGap>
                    )}
                </div>
            ))}
        </Container>
    );
};
export default CertificateList;

const Title = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 20px;
    line-height: 32px;
    color: #111111;
`;

const AddButton = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 18px;
    line-height: 24px;
    color: #797979;
    cursor: pointer;
`;

const TopRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Container = styled.div`
    width: 50vw;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    padding: 20px;
    box-sizing: border-box;
`;

const InputsGap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 15px 0px;
    box-sizing: border-box;
`;

const StyledButton = styled.button`
    width: 100%;
    height: 48px;
    border: none;
    background: #2de283;
    color: #ffffff;
    font-size: 16px;
    line-height: 20px;
    font-family: 'Pretendard';
    font-weight: 400;
    border-radius: 8px;
    cursor: pointer;
`;

const Divider = styled.div`
    width: 100%;
    height: 1px;
    background: #d9d9d9;
`;

const EditButton = styled.button`
    padding: 10px 20px;
    border: none;
    background: #2de283;
    color: #ffffff;
    font-size: 16px;
    line-height: 20px;
    font-family: 'Pretendard';
    font-weight: 400;
    border-radius: 8px;
    cursor: pointer;
`;

const DelteButton = styled.button`
    padding: 10px 20px;
    border: none;
    background: #2de283;
    color: #ffffff;
    font-size: 16px;
    line-height: 20px;
    font-family: 'Pretendard';
    font-weight: 400;
    border-radius: 8px;
    cursor: pointer;
`;

const EditRow = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
`;

const LoaderContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`;
