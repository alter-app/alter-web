import styled from 'styled-components';
import { useEffect, useState, useRef } from 'react';
import {
    getCertificates,
    deleteCertificates,
    addCertificates,
    eidtCertificates,
    getCertificateDetail,
} from '../../../services/myPage';
import { formatDateInput } from '../../../utils/weekUtil';
import CertificateInputForm from './CertificateInputForm';
import Loader from '../../Loader';
import { formatJoinDate } from '../../../utils/timeUtil';

const CertificateList = ({ isActive }) => {
    const [certificates, setCertificates] = useState([]);
    const [addStatus, setAddStatus] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [hasInitialLoad, setHasInitialLoad] = useState(false);
    const containerRef = useRef(null);

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
        if (!hasInitialLoad) {
            const fetchCertificates = async () => {
                const result = await getCertificates();
                setCertificates(result.data);
            };
            fetchCertificates();
            setHasInitialLoad(true);
            console.log(certificates);
        }
    }, [hasInitialLoad]);

    // 자격 삭제 처리 함수
    const handleDelete = async (id) => {
        const isConfirmed = window.confirm('정말 삭제하시겠습니까?');
        if (!isConfirmed) {
            return;
        }

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
        // 필수 필드 검증
        const requiredFields = [
            { key: 'certificateName', label: '이름' },
            { key: 'publisherName', label: '발행 기관' },
            { key: 'issuedAt', label: '취득일' }
        ];

        const missingFields = requiredFields.filter(field => {
            const fieldValue = addCertificate[field.key];
            return !fieldValue || fieldValue.trim() === '';
        });

        if (missingFields.length > 0) {
            const fieldNames = missingFields.map(field => field.label).join(', ');
            alert(`${fieldNames}을(를) 입력해주세요.`);
            return;
        }

        const isConfirmed = window.confirm('정말 등록하시겠습니까?');
        if (!isConfirmed) {
            return;
        }

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
        // 필수 필드 검증
        const requiredFields = [
            { key: 'certificateName', label: '이름' },
            { key: 'publisherName', label: '발행 기관' },
            { key: 'issuedAt', label: '취득일' }
        ];

        const missingFields = requiredFields.filter(field => {
            const fieldValue = editCertificate[field.key];
            return !fieldValue || fieldValue.trim() === '';
        });

        if (missingFields.length > 0) {
            const fieldNames = missingFields.map(field => field.label).join(', ');
            alert(`${fieldNames}을(를) 입력해주세요.`);
            return;
        }

        const isConfirmed = window.confirm('정말 수정하시겠습니까?');
        if (!isConfirmed) {
            return;
        }

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

    if (!isActive) {
        return null;
    }

    return (
        <Container ref={containerRef}>
            <Header>
                <Title>자격사항 관리</Title>
                <AddButton onClick={handleToggleAdd}>
                    {addStatus ? '취소' : '추가'}
                </AddButton>
            </Header>
            
            {addStatus && (
                <AddFormContainer>
                    <CertificateInputForm
                        value={addCertificate}
                        onChange={handleInputChange}
                    />
                    <RegisterButton onClick={handleAddCertificate}>
                        등록하기
                    </RegisterButton>
                </AddFormContainer>
            )}

            {certificates.length === 0 && !addStatus ? (
                <EmptyContainer>
                    <EmptyIcon>📜</EmptyIcon>
                    <EmptyText>등록된 자격사항이 없습니다.</EmptyText>
                </EmptyContainer>
            ) : (
                certificates.map((cert) => (
                    <CertificateCard key={cert.id}>
                        <CertificateHeader
                            onClick={() => handleToggleEdit(cert)}
                        >
                            <CertificateInfo>
                                <CertificateName>{cert.certificateName}</CertificateName>
                                <PublisherName>{cert.publisherName}</PublisherName>
                                <IssuedDate>
                                    발급일 : {formatJoinDate(cert.issuedAt)}
                                </IssuedDate>
                                {cert.expiresAt && (
                                    <ExpiredDate>
                                        만료일 : {formatJoinDate(cert.expiresAt)}
                                    </ExpiredDate>
                                )}
                            </CertificateInfo>
                            <ExpandIcon>
                                <EditIcon viewBox="0 0 24 24" width="20" height="20">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                </EditIcon>
                            </ExpandIcon>
                            <DeleteButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(cert.id);
                                }}
                            >
                                <DeleteIcon viewBox="0 0 24 24" width="20" height="20">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </DeleteIcon>
                            </DeleteButton>
                        </CertificateHeader>
                        
                        {editingId === cert.id && (
                            <EditFormContainer>
                                {detailLoading ? (
                                    <LoaderContainer>
                                        <Loader />
                                    </LoaderContainer>
                                ) : (
                                    <>
                                        <CertificateInputForm
                                            value={editCertificate}
                                            onChange={handleEditInputChange}
                                        />
                                        <EditButton onClick={handleEditSave}>
                                            수정하기
                                        </EditButton>
                                        <CancelButton onClick={() => setEditingId(null)}>
                                            취소
                                        </CancelButton>
                                    </>
                                )}
                            </EditFormContainer>
                        )}
                        
                    </CertificateCard>
                ))
            )}
        </Container>
    );
};
export default CertificateList;

const Container = styled.div`
    width: 100%;
    background-color: transparent;
    display: flex;
    flex-direction: column;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    padding: 8px 20px 4px 20px;
`;

const Title = styled.div`
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 20px;
    line-height: 32px;
    color: #111111;
`;

const AddButton = styled.button`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #111111;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px 0;
`;

const RegisterButton = styled.button`
    width: 100%;
    height: 48px;
    border: none;
    background: #2de283;
    color: #ffffff;
    font-size: 16px;
    font-family: 'Pretendard';
    font-weight: 700;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:active {
        transform: scale(0.98);
    }
`;

const AddFormContainer = styled.div`
    background: #ffffff;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const EmptyContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 300px;
    background: #ffffff;
    margin: 2px 0;
`;

const EmptyIcon = styled.div`
    font-size: 80px;
    margin-bottom: 16px;
`;

const EmptyText = styled.div`
    font-family: 'Pretendard';
    font-weight: 400;
    font-size: 16px;
    color: #999999;
`;

const CertificateCard = styled.div`
    background: #ffffff;
    margin: 2px 0;
`;

const CertificateHeader = styled.div`
    display: flex;
    align-items: center;
    padding: 16px 20px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #f8f9fa;
    }
`;

const CertificateInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const CertificateName = styled.div`
    font-family: 'Pretendard';
    font-weight: 700;
    font-size: 16px;
    color: #111111;
`;

const PublisherName = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #999999;
`;

const IssuedDate = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #999999;
`;

const ExpiredDate = styled.div`
    font-family: 'Pretendard';
    font-weight: 500;
    font-size: 14px;
    color: #999999;
`;

const ExpandIcon = styled.div`
    font-size: 16px;
    color: #999999;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const EditIcon = styled.svg`
    fill: #666666;
`;

const DeleteIcon = styled.svg`
    fill: #666666;
`;

const DeleteButton = styled.button`
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #f5f5f5;
    }
`;

const EditFormContainer = styled.div`
    background: #ffffff;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border-top: 1px solid #e0e0e0;
`;

const EditButton = styled.button`
    width: 100%;
    height: 48px;
    border: none;
    background: #2de283;
    color: #ffffff;
    font-size: 16px;
    font-family: 'Pretendard';
    font-weight: 400;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background: #25c973;
    }
`;

const CancelButton = styled.button`
    width: 100%;
    height: 48px;
    border: 1px solid #e0e0e0;
    background: #ffffff;
    color: #999999;
    font-size: 16px;
    font-family: 'Pretendard';
    font-weight: 400;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #f8f9fa;
        color: #111111;
    }
`;

const LoaderContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100px;
`;
